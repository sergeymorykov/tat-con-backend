const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tatcon')
  .then(() => {
    console.log('MongoDB подключена');
  })
  .catch(err => {
    console.error('Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  });

// Загрузка proto-файлов
const PROTO_PATH = path.resolve(__dirname, '../protos');

const packageDefinition = protoLoader.loadSync(
  [
    path.join(PROTO_PATH, 'auth.proto'),
    path.join(PROTO_PATH, 'profile.proto')
  ],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [PROTO_PATH]
  }
);

// Создание gRPC сервера
const server = new grpc.Server();

// Импорт сервисов
const authService = require('./services/authService');
const profileService = require('./services/profileService');

// Регистрация сервисов
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
const profileProto = grpc.loadPackageDefinition(packageDefinition).profile;

server.addService(authProto.AuthService.service, authService);
server.addService(profileProto.ProfileService.service, profileService);

// Запуск сервера
const PORT = process.env.PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Ошибка при запуске сервера:', err);
      process.exit(1);
    }
    server.start();
    console.log(`gRPC сервер запущен на порту ${port}`);
  }
); 