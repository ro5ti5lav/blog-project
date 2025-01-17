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

// Улучшенный перехватчик ответов
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            requestData: error.config?.data
        });

        if (error.response?.status === 500) {
            console.error('Server Error Details:', error.response.data);
        } else if (!error.response) {
            console.error('Network Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (data: LoginData) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', data);
            return response;
        } catch (error: any) {
            console.error('Login Error:', {
                data: data,
                error: error.response?.data || error.message
            });
            throw error;
        }
    },

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