import React, { useEffect, useState, useCallback } from 'react';
import { Container } from '@mui/material';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import { PostCard } from '../components/PostCard';
import { CreatePostForm } from '../components/CreatePostForm';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useAuth();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await postsAPI.getPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке постов:', error);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id: number) => {
        try {
            await postsAPI.deletePost(id);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
        }
    };

    const handleUpdate = async (id: number, message: string) => {
        try {
            const response = await postsAPI.updatePost(id, { message });
            setPosts(prevPosts =>
                prevPosts.map(post => post.id === id ? response.data : post)
            );
        } catch (error) {
            console.error('Ошибка при обновлении поста:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {user && <CreatePostForm onPostCreated={fetchPosts} />}
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            ))}
        </Container>
    );
}; 