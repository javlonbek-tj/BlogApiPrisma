import { Router } from 'express';
import authRoutes from './auth.routes';

const api = Router();

api.use('/', authRoutes);

export default api;
