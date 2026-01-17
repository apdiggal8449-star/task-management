import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔥 restore user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🔐 LOGIN
  const login = async (data) => {
    try {
      const res = await api.post('/auth/login', data);

      // ✅ save token
      localStorage.setItem('token', res.data.token);

      // ✅ save user
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      return res.data;
    } catch (err) {
      console.error('Login Failed:', err.response?.data || err.message);
      throw err;
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
