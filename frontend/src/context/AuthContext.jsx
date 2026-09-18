import React, { createContext, useContext, useState } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || 'null');
    } catch {
      return null;
    }
  });

  const login = async (contact, password) => {
    const authData = await apiClient.login(contact, password);
    setUser(authData);
    return authData;
  };

  const register = async (userData) => {
    const authData = await apiClient.register(userData);
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const adminLogin = async (contact, password) => {
    const data = await apiClient.adminLogin(contact, password);
    setAdminUser(data);
    return data;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isLoggedIn: Boolean(user),
        isAdmin: Boolean(adminUser),
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
