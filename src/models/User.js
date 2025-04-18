import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Схема пользователя
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Имя пользователя обязательно'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Пожалуйста, введите корректный email'],
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      minlength: [6, 'Пароль должен содержать минимум 6 символов'],
    },
    avatar: {
      type: String,
      default: 'https://randomuser.me/api/portraits/lego/1.jpg',
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  // Если пароль не был изменен, пропускаем хеширование
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Экспорт модели
const User = mongoose.model('User', userSchema);
export default User; 