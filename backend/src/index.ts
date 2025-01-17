import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import ormconfig from './ormconfig';
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
    console.error('Детали ошибки:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
    });

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Внутренняя ошибка сервера',
            details: process.env.NODE_ENV === 'development' ? {
                stack: err.stack,
                path: req.path,
                method: req.method
            } : undefined
        }
    });
});

// Добавим обработку ошибок для асинхронных маршрутов
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Добавим перед обработчиком 404
app.get('/', (req, res) => {
    res.json({ message: 'API работает' });
});

// Перенесем этот обработчик в конец всех маршрутов
app.use((req: express.Request, res: express.Response) => {
    console.log('Неизвестный маршрут:', {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
    });

    res.status(404).json({
        error: {
            message: 'Маршрут не найден',
            path: req.path,
            method: req.method
        }
    });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        // Используем конфигурацию из ormconfig
        await createConnection({
            ...ormconfig,
            entities: [path.join(__dirname, 'entities', '*.js')],
            migrations: [path.join(__dirname, 'migrations', '*.js')]
        });

        console.log('База данных подключена успешно');

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (error: any) {
        console.error('Детали ошибки подключения:', {
            error: error.message,
            stack: error.stack,
            config: {
                type: ormconfig.type,
                url: process.env.DATABASE_URL ? '***' : undefined,
                entities: ormconfig.entities,
                migrations: ormconfig.migrations
            }
        });
    }
};

// Экспортируем app для Vercel
export default app;

// Запускаем сервер только если не в Vercel
if (process.env.NODE_ENV !== 'production') {
    start();
} 