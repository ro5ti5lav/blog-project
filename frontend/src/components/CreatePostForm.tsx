import React, { useState, useRef } from 'react';
import { TextField, Button, Box, Alert, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { postsAPI } from '../services/api';

interface CreatePostFormProps {
    onPostCreated: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('message', message);
            if (selectedFile) {
                formData.append('media', selectedFile);
            }

            await postsAPI.createPost(formData);
            setMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onPostCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при создании поста');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                fullWidth
                label="Сообщение"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                margin="normal"
                required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
                <input
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    id="media-file"
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <label htmlFor="media-file">
                    <IconButton color="primary" component="span">
                        <PhotoCamera />
                    </IconButton>
                    {selectedFile && <span>{selectedFile.name}</span>}
                </label>
            </Box>
            <Button
                type="submit"
                variant="contained"
                fullWidth
            >
                Создать пост
            </Button>
        </Box>
    );
}; 