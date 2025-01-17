export interface User {
    id: number;
    email: string;
    username: string;
}

export interface Post {
    id: number;
    message: string;
    mediaUrl?: string;
    createdAt: string;
    updatedAt: string;
    author: User;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    username: string;
} 