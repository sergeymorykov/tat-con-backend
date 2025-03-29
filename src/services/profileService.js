const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Реализация gRPC методов
const profileService = {
  getProfile: async (call, callback) => {
    try {
      const { userId } = call.request;

      const user = await User.findById(userId);
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Пользователь не найден',
        });
      }

      callback(null, {
        success: true,
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

  updateProfile: async (call, callback) => {
    try {
      const { userId, name, description, meetingGoal } = call.request;

      const user = await User.findById(userId);
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Пользователь не найден',
        });
      }

      // Обновление полей
      user.name = name || user.name;
      user.description = description || user.description;
      user.meetingGoal = meetingGoal || user.meetingGoal;

      await user.save();

      callback(null, {
        success: true,
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

  updatePhoto: async (call, callback) => {
    try {
      const { userId, photo } = call.request;

      const user = await User.findById(userId);
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Пользователь не найден',
        });
      }

      // TODO: Реализовать загрузку фото
      // user.photo = photo;

      await user.save();

      callback(null, {
        success: true,
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

  addInterest: async (call, callback) => {
    try {
      const { userId, interest } = call.request;

      const user = await User.findById(userId);
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Пользователь не найден',
        });
      }

      if (!user.interests.includes(interest)) {
        user.interests.push(interest);
        await user.save();
      }

      callback(null, {
        success: true,
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

  removeInterest: async (call, callback) => {
    try {
      const { userId, interest } = call.request;

      const user = await User.findById(userId);
      if (!user) {
        return callback(null, {
          success: false,
          error: 'Пользователь не найден',
        });
      }

      user.interests = user.interests.filter(i => i !== interest);
      await user.save();

      callback(null, {
        success: true,
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
};

module.exports = profileService; 