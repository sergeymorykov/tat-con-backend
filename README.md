# TatCon Backend

gRPC сервер для приложения TatCon.

## Требования

- Node.js 18+
- MongoDB
- Protocol Buffers (protoc)
- gRPC Web

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/tatcon.git
cd tatcon/backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env на основе .env.example:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в файле .env

5. Сгенерируйте gRPC код:
```bash
npm run generate
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API

### Auth Service

- `Register` - регистрация нового пользователя
- `Login` - вход в систему
- `GoogleAuth` - аутентификация через Google
- `FacebookAuth` - аутентификация через Facebook
- `VKAuth` - аутентификация через ВКонтакте
- `Logout` - выход из системы

### Profile Service

- `GetProfile` - получение профиля пользователя
- `UpdateProfile` - обновление профиля
- `UpdatePhoto` - обновление фото профиля
- `AddInterest` - добавление интереса
- `RemoveInterest` - удаление интереса

## Структура проекта

```
backend/
├── protos/           # Proto файлы
├── src/
│   ├── models/      # Mongoose модели
│   ├── services/    # gRPC сервисы
│   └── index.js     # Точка входа
├── .env             # Переменные окружения
├── .env.example     # Пример переменных окружения
├── package.json     # Зависимости и скрипты
└── README.md        # Документация
``` 