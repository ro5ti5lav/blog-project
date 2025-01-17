import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'https://ro5ti5lav.github.io',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Измените путь к uploads, используя абсолютный путь
const uploadsPath = path.resolve(__dirname, '..', 'uploads');
console.log('Путь к uploads:', uploadsPath); // для отладки

// Статические файлы
app.use('/uploads', express.static(uploadsPath));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Добавить перед другими маршрутами
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await createConnection();
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
    }
};

start(); 