import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Расширяем интерфейс Request для включения пользователя
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tatcon-secret-key';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нет доступа. Требуется аутентификация.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Проверяем валидность токена
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Находим пользователя по ID из токена
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден.' });
    }
    
    // Добавляем пользователя в объект запроса
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен. Требуется повторная аутентификация.' });
  }
}; 