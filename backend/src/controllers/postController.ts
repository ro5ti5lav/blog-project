import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        const postRepository = getRepository(Post);
        const userRepository = getRepository(User);

        const user = await userRepository.findOne(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        let mediaUrl = '';
        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
        }

        const post = postRepository.create({
            message,
            mediaUrl,
            author: user
        });

        await postRepository.save(post);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании поста' });
    }
};

export const getPosts = async (_req: Request, res: Response) => {
    try {
        const postRepository = getRepository(Post);
        const posts = await postRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении постов' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { message, mediaUrl } = req.body;
        const postRepository = getRepository(Post);

        const post = await postRepository.findOne(id, { relations: ['author'] });
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        if (post.author.id !== req.user.userId) {
            return res.status(403).json({ message: 'Нет прав для редактирования' });
        }

        post.message = message;
        if (mediaUrl) post.mediaUrl = mediaUrl;

        await postRepository.save(post);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении поста' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const postRepository = getRepository(Post);

        const post = await postRepository.findOne(id, { relations: ['author'] });
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        if (post.author.id !== req.user.userId) {
            return res.status(403).json({ message: 'Нет прав для удаления' });
        }

        await postRepository.remove(post);
        res.json({ message: 'Пост успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении поста' });
    }
}; 