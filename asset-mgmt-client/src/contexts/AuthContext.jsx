import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken) {
      try {
        // Try to get user profile with current access token
        const response = await api.get('/auth/profile');
        setUser(response.data);
        setIsAdmin(response.data.role === 'Admin');
        setLoading(false);
        return;
      } catch (error) {
        // Access token expired, try refresh token
        if (refreshToken) {
          try {
            const refreshResponse = await api.post('/auth/refresh-token', {
              refreshToken: refreshToken
            });
            
            const { accessToken: newAccessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Get user profile with new token
            const profileResponse = await api.get('/auth/profile');
            setUser(profileResponse.data);
            setIsAdmin(profileResponse.data.role === 'Admin');
            setLoading(false);
            return;
          } catch (refreshError) {
            // Refresh token failed, clear all tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } else {
          localStorage.removeItem('accessToken');
        }
      }
    }
    
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Get user profile
      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);
      setIsAdmin(profileResponse.data.role === 'Admin');
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 