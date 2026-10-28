import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: 'civicfix-api',
    status: 'healthy',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

export const healthRoutes = router;
