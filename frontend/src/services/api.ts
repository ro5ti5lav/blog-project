import axios from 'axios';
import { LoginData, RegisterData, AuthResponse, Post } from '../types';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://blog-project-gamma-two.vercel.app/api';
console.log('API URL:', baseURL);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
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