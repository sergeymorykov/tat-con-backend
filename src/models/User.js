const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Пожалуйста, введите корректный email'],
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    maxlength: [50, 'Имя не может быть длиннее 50 символов'],
  },
  photo: {
    type: String,
    default: '',
  },
  interests: [{
    type: String,
  }],
  description: {
    type: String,
    maxlength: [500, 'Описание не может быть длиннее 500 символов'],
    default: '',
  },
  meetingGoal: {
    type: String,
    maxlength: [500, 'Цель встречи не может быть длиннее 500 символов'],
    default: '',
  },
  isNewUser: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema); 