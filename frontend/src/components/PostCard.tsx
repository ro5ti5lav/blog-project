import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
    post: Post;
    onDelete: (id: number) => void;
    onUpdate: (id: number, message: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(post.message);
    const { user } = useAuth();

    const isAuthor = user?.id === post.author.id;

    const handleUpdate = () => {
        onUpdate(post.id, message);
        setIsEditing(false);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {isEditing ? (
                    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <TextField
                            fullWidth
                            multiline
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" onClick={handleUpdate} sx={{ mr: 1 }}>
                            Сохранить
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>
                            Отмена
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {post.message}
                        </Typography>
                        {post.mediaUrl && (
                            <Box sx={{ mb: 2 }}>
                                <img
                                    src={`http://localhost:5000${post.mediaUrl}`}
                                    alt="Media"
                                    style={{ maxWidth: '100%' }}
                                    onError={(e) => {
                                        console.error('Ошибка загрузки изображения:', e);
                                        console.log('URL изображения:', `http://localhost:5000${post.mediaUrl}`);
                                    }}
                                />
                            </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                            Автор: {post.author.username} | {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                    </>
                )}
            </CardContent>
            {isAuthor && !isEditing && (
                <CardActions>
                    <IconButton onClick={() => setIsEditing(true)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(post.id)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    );
}; 