import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('mini_ecom_token');
      if (token) {
        try {
          const res = await getProfileApi();
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('mini_ecom_token');
          }
        } catch (error) {
          localStorage.removeItem('mini_ecom_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials);
      if (res.success) {
        localStorage.setItem('mini_ecom_token', res.data.token);
        setUser(res.data);
        addToast(`Welcome back, ${res.data.name}!`, 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      if (res.success) {
        localStorage.setItem('mini_ecom_token', res.data.token);
        setUser(res.data);
        addToast('Account registered successfully!', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mini_ecom_token');
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
