import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('notes_app_user');
    const token = localStorage.getItem('notes_app_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    const userProfile = {
      id: data.id,
      username: data.username,
      email: data.email,
      theme: data.theme || 'light'
    };
    localStorage.setItem('notes_app_token', data.accessToken);
    localStorage.setItem('notes_app_user', JSON.stringify(userProfile));
    setUser(userProfile);
    return data;
  };

  const signup = async (username, email, password) => {
    return await api.signup(username, email, password);
  };

  const updateTheme = async (newTheme) => {
    try {
      await api.updateTheme(newTheme);
      if (user) {
        const updatedUser = { ...user, theme: newTheme };
        localStorage.setItem('notes_app_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Failed to sync theme preference with backend:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('notes_app_token');
    localStorage.removeItem('notes_app_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateTheme, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
