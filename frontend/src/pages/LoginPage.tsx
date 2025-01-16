import React from 'react';
import { Container } from '@mui/material';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <LoginForm />
        </Container>
    );
}; 