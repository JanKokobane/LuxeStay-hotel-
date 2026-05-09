import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tango-hotel-backend.onrender.com';

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user profile');

      const result = await res.json();
      setUser(result.user);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUser(null);
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    await fetchUserProfile(newToken); 
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (token) await fetchUserProfile(token);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserProfile(storedToken); 
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
