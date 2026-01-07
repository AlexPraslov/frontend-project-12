import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { initSocket, disconnectSocket } from '../socket';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Инициализируем WebSocket после установки токена
      initSocket(token);
    } else {
      localStorage.removeItem('token');
      disconnectSocket();
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username,
        password,
      });

      const { token: newToken } = response.data;
      setToken(newToken);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка авторизации'
      };
    }
  };

  const logout = () => {
    setToken(null);
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
