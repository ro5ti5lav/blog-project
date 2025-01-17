import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', register);
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log('Попытка входа:', { email, hasPassword: !!password });

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            console.log('Пользователь не найден:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.log('Неверный пароль для пользователя:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error('Ошибка при входе:', {
            error: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ message: error.message || 'Ошибка при входе' });
    }
});

export default router; 