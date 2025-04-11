import express from 'express';
import { register, login, getCurrentUser, updateUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.post('/users/register', register);
router.post('/users/login', login);

// Защищенные маршруты (требуют авторизации)
router.get('/users/me', authMiddleware, getCurrentUser);
router.put('/users/me', authMiddleware, updateUserProfile);

export default router; 