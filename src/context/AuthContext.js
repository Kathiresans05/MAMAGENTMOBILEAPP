import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                apiClient.defaults.headers.common['x-auth-token'] = parsedUser.token;
            }
        } catch (e) {
            console.log('Failed to load user', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await apiClient.post('/auth/login', { email, password });
        const userData = { ...res.data.user, token: res.data.token };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        apiClient.defaults.headers.common['x-auth-token'] = res.data.token;
        setUser(userData);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('user');
        delete apiClient.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
