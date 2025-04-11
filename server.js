import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';

// Загрузка переменных окружения
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tatcon';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

// Маршруты API
app.use('/api', userRoutes);

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ 
    message: 'Сервер работает!',
    api: {
      register: 'POST /api/users/register',
      login: 'POST /api/users/login',
      currentUser: 'GET /api/users/me',
      updateProfile: 'PUT /api/users/me'
    }
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
