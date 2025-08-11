import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Export the context directly so it can be imported by the useAuth hook
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/profile');
      console.log('Profile response data:', response.data);
      console.log('Role from profile:', response.data.role);
      console.log('Role from profile (capitalized):', response.data.Role);
      // Make sure we're setting the role with the correct case
      const userData = {
        ...response.data,
        Role: response.data.role || response.data.Role
      };
      console.log('Final user data being set:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      
      // Get user profile after successful login
      const profileResponse = await api.get('/auth/profile');
      console.log('Profile response after login:', profileResponse.data);
      
      // Make sure we're setting the role with the correct case
      const userData = {
        ...profileResponse.data,
        Role: profileResponse.data.role || profileResponse.data.Role
      };
      console.log('Final user data being set after login:', userData);
      setUser(userData);
      
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
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // This will clear the HTTP-only refresh token cookie on the server
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      // No need to remove refreshToken from localStorage as it's now an HTTP-only cookie
    }
  };

  const isAdmin = () => {
    console.log('User in isAdmin:', user);
    console.log('User role:', user?.Role);
    console.log('Is admin check result:', user?.Role === 'Admin');
    return user?.Role === 'Admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
