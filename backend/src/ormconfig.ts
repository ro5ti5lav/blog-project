import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true, // В продакшене лучше установить false
    logging: true,
    entities: [
        'src/entities/**/*.ts'
    ],
    migrations: [
        'src/migrations/**/*.ts'
    ],
    subscribers: [
        'src/subscribers/**/*.ts'
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    },
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};

export default config; 