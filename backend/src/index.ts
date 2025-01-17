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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://ro5ti5lav.github.io');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
});

app.use(cors({
    origin: 'https://ro5ti5lav.github.io',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
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