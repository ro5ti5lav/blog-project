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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200,
    preflightContinue: false
}));

// Упрощенная обработка OPTIONS запросов
app.options('*', cors());

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

// Глобальный обработчик ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Ошибка сервера:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Внутренняя ошибка сервера',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

// Обработка несуществующих маршрутов
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: {
            message: 'Маршрут не найден'
        }
    });
});

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