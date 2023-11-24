import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const api = Router();

api.use('/', authRoutes);
api.use('/users', userRoutes);

export default api;
