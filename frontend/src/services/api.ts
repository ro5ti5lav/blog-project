import axios from 'axios';
import { LoginData, RegisterData, AuthResponse, Post } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (data: LoginData) =>
        api.post<AuthResponse>('/auth/login', data),

    register: (data: RegisterData) =>
        api.post<AuthResponse>('/auth/register', data)
};

export const postsAPI = {
    getPosts: () =>
        api.get<Post[]>('/posts'),

    createPost: (data: FormData) =>
        api.post<Post>('/posts', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),

    updatePost: (id: number, data: { message: string; mediaUrl?: string }) =>
        api.put<Post>(`/posts/${id}`, data),

    deletePost: (id: number) =>
        api.delete(`/posts/${id}`)
}; 