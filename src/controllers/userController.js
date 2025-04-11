import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tatcon-secret-key';
// Срок действия токена (14 дней)
const JWT_EXPIRES_IN = '14d';

// Создание JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Регистрация нового пользователя
export const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Проверяем наличие обязательных полей
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, укажите имя, email и пароль' });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar || undefined // Используем дефолтное значение из схемы, если аватар не указан
    });

    // Создаем токен
    const token = generateToken(user._id);

    // Отправляем ответ без пароля
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        interests: user.interests,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Авторизация пользователя
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем наличие email и пароля
    if (!email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, укажите email и пароль' });
    }

    // Находим пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создаем токен
    const token = generateToken(user._id);

    // Отправляем ответ без пароля
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        interests: user.interests,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение данных о текущем пользователе
export const getCurrentUser = async (req, res) => {
  try {
    // Пользователь уже добавлен в req.user через middleware аутентификации
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        interests: user.interests,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление данных пользователя
export const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, avatar, interests } = req.body;

    // Обновляем только предоставленные поля
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (interests) user.interests = interests;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        interests: user.interests,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 