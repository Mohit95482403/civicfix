import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 CivicFix REST API Server listening on port ${env.PORT}`, {
    port: env.PORT,
    environment: env.NODE_ENV,
    healthEndpoint: `http://localhost:${env.PORT}/api/health`,
    apiV1Prefix: `http://localhost:${env.PORT}/api/v1`,
  });
});

// Graceful Shutdown Handlers
function handleGracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed successfully. Process exiting.');
    process.exit(0);
  });

  // Force close after 10s if connections refuse to terminate
  setTimeout(() => {
    logger.error('Forced shutdown due to timed-out active connections.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
