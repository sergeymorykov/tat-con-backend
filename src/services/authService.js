const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Инициализация Google OAuth клиента
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Реализация gRPC методов
const authService = {
  register: async (call, callback) => {
    try {
      const { email, password, name } = call.request;

      // Проверка существующего пользователя
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return callback(null, {
          success: false,
          error: 'Пользователь с таким email уже существует',
        });
      }

      // Хеширование пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Создание пользователя
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        isNewUser: true,
      });

      // Генерация токена
      const token = generateToken(user._id);

      callback(null, {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          photo: user.photo,
          interests: user.interests,
          description: user.description,
          meetingGoal: user.meetingGoal,
          isNewUser: user.isNewUser,
        },
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },

  login: async (call, callback) => {
    try {
      const { email, password } = call.request;

      // Поиск пользователя
      const user = await User.findOne({ email });
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Неверный email или пароль',
        });
      }

      // Проверка пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return callback(null, {
          success: false,
          error: 'Неверный email или пароль',
        });
      }

      // Генерация токена
      const token = generateToken(user._id);

      callback(null, {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          photo: user.photo,
          interests: user.interests,
          description: user.description,
          meetingGoal: user.meetingGoal,
          isNewUser: user.isNewUser,
        },
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },

  googleAuth: async (call, callback) => {
    try {
      const { token } = call.request;

      // Верификация Google токена
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return callback(null, {
          success: false,
          error: 'Неверный токен Google',
        });
      }

      // Поиск или создание пользователя
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = await User.create({
          email: payload.email,
          name: payload.name,
          photo: payload.picture,
          isNewUser: true,
        });
      }

      // Генерация токена
      const jwtToken = generateToken(user._id);

      callback(null, {
        success: true,
        token: jwtToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          photo: user.photo,
          interests: user.interests,
          description: user.description,
          meetingGoal: user.meetingGoal,
          isNewUser: user.isNewUser,
        },
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },

  facebookAuth: async (call, callback) => {
    try {
      const { token } = call.request;
      // TODO: Реализовать Facebook аутентификацию
      callback(null, {
        success: false,
        error: 'Facebook аутентификация пока не реализована',
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },

  vkAuth: async (call, callback) => {
    try {
      const { token } = call.request;
      // TODO: Реализовать VK аутентификацию
      callback(null, {
        success: false,
        error: 'VK аутентификация пока не реализована',
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },

  logout: async (call, callback) => {
    try {
      // В gRPC нет необходимости в серверной части для logout
      // Клиент просто удаляет токен
      callback(null, {
        success: true,
      });
    } catch (error) {
      callback(null, {
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = authService; 