import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { apiRateLimiter } from './middleware/rate-limit.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import { apiV1Router } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // 1. Security Headers (Helmet)
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing (CORS) with Explicit Allowlist
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (env.FRONTEND_ALLOWED_ORIGINS.includes(origin) || env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  // 3. Request Body Parsing with Strict 1MB Limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Request ID Tracing Middleware
  app.use(requestIdMiddleware);

  // 5. Structured HTTP Request Logging
  app.use(requestLogger);

  // 6. Global API Rate Limiting
  app.use('/api', apiRateLimiter);

  // 7. Direct Health Endpoints (Convenience Route: /api/health and /api/health/ready)
  app.use('/api', healthRoutes);

  // 8. Versioned API Router (/api/v1)
  app.use('/api/v1', apiV1Router);

  // 9. 404 Catch-All Handler
  app.use(notFoundHandler);

  // 10. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
