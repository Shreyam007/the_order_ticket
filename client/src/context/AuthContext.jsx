import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (token && !user) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  // Real-Time SSE Listener for profile updates
  useEffect(() => {
    let eventSource = null;
    try {
      eventSource = new EventSource('http://localhost:5000/api/events/stream');
      
      eventSource.addEventListener('user:profileUpdated', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.name) {
            setUser((prev) => {
              const updated = { ...prev, ...data.user, name: data.name };
              localStorage.setItem('user', JSON.stringify(updated));
              return updated;
            });
          }
        } catch (e) {
          console.error('Error parsing SSE profile update event:', e);
        }
      });
    } catch (e) {
      console.warn('SSE connection failed in AuthContext:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user: userData } = res.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    const { accessToken, user: newUser } = res.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(accessToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
