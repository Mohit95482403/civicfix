import { Router } from 'express';
import { healthRoutes } from './health.routes.js';

const apiV1Router = Router();

// Mount health routes under /api/v1/health
apiV1Router.use('/', healthRoutes);

// Future Phase Route Stubs (Day 5 & 6)
// apiV1Router.use('/auth', authRoutes);
// apiV1Router.use('/complaints', complaintRoutes);
// apiV1Router.use('/workflow', workflowRoutes);
// apiV1Router.use('/admin', adminRoutes);

export { apiV1Router };
