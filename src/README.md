# TatCon Backend API

Это бэкенд-сервер для приложения TatCon, предоставляющий API для работы с пользователями.

## Установка и запуск

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте файл `.env` в корне проекта со следующими переменными:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tatcon
   JWT_SECRET=ваш_секретный_ключ
   ```

3. Запустите сервер в режиме разработки:
   ```bash
   npm run dev
   ```

## API Endpoints

### Аутентификация

#### Регистрация пользователя
- **URL**: `/api/users/register`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "password": "password123",
    "avatar": "https://example.com/avatar.jpg" // Необязательное поле
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "avatar": "url_to_avatar",
      "interests": [],
      "createdAt": "date_here"
    }
  }
  ```
- **Ошибки**: 
  - `400 Bad Request` - если пользователь уже существует
  - `400 Bad Request` - если не указаны обязательные поля (имя, email, пароль)

#### Вход в систему
- **URL**: `/api/users/login`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "email": "ivan@example.com",
    "password": "password123"
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "avatar": "url_to_avatar",
      "interests": [],
      "createdAt": "date_here"
    }
  }
  ```
- **Ошибка**: `401 Unauthorized` при неверных учетных данных

### Профиль пользователя

#### Получение данных текущего пользователя
- **URL**: `/api/users/me`
- **Метод**: `GET`
- **Заголовки**: 
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Успешный ответ**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "user_id",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "avatar": "url_to_avatar",
      "interests": [],
      "createdAt": "date_here"
    }
  }
  ```
- **Ошибка**: `401 Unauthorized` при отсутствии токена

#### Обновление данных пользователя
- **URL**: `/api/users/me`
- **Метод**: `PUT`
- **Заголовки**: 
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Тело запроса**:
  ```json
  {
    "name": "Иван Петров",
    "avatar": "new_avatar_url",
    "interests": ["Кино", "Книги", "Технологии"]
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "user_id",
      "name": "Иван Петров",
      "email": "ivan@example.com",
      "avatar": "new_avatar_url",
      "interests": ["Кино", "Книги", "Технологии"],
      "createdAt": "date_here"
    }
  }
  ```
- **Ошибка**: `401 Unauthorized` при отсутствии токена

## Модель пользователя

```javascript
{
  name: String,           // Имя пользователя
  email: String,          // Email (уникальный)
  password: String,       // Пароль (хранится в хешированном виде)
  avatar: String,         // URL аватара (по умолчанию предоставляется)
  interests: [String],    // Массив интересов (пустой по умолчанию)
  createdAt: Date,        // Дата создания
  updatedAt: Date         // Дата обновления
}
``` 