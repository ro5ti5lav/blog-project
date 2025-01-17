# Blog Project

Fullstack блог-платформа с авторизацией, созданием постов и загрузкой медиафайлов.

## Технологии

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

## Структура проекта 
blog-project/
├── frontend/ # React приложение
├── backend/ # Express сервер
└── uploads/ # Папка для загруженных файлов


## Установка и запуск

### Предварительные требования
- Node.js (v14+)
- PostgreSQL
- npm или yarn

### Backend
bash
cd backend
npm install
Создайте .env файл на основе .env.example
npm run dev


### Frontend
ash
cd frontend
npm install
Создайте .env файл на основе .env.example
npm start


## Конфигурация

### Backend (.env)
env
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=blog_db


### Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000


## API Документация

API документация доступна по адресу `/api-docs` после запуска backend.

### Основные эндпоинты:

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Авторизация
- `GET /api/posts` - Получение всех постов
- `POST /api/posts` - Создание поста
- `PUT /api/posts/:id` - Обновление поста
- `DELETE /api/posts/:id` - Удаление поста

## Деплой

### Backend (Vercel)
1. Создайте аккаунт на Vercel
2. Подключите репозиторий
3. Настройте переменные окружения
4. Деплой произойдет автоматически

### Frontend (GitHub Pages или Vercel)
1. Обновите REACT_APP_API_URL в .env
2. Выполните сборку: `npm run build`
3. Разместите содержимое папки build

## Разработка

### Сборка проекта
В корневой директории:
npm run build


### Структура базы данных

- Users
  - id
  - username
  - password (хэшированный)
  - createdAt
  - updatedAt

- Posts
  - id
  - message
  - mediaUrl
  - authorId
  - createdAt
  - updatedAt

## Лицензия

MIT

## Авторы

- [Mikhail Kushnir](https://github.com/ro5ti5lav)