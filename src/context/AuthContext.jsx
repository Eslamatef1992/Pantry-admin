import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data.user.role !== 'admin') throw new Error('not admin');
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token');
      })
      .finally(() => setLoading(false));
  }, []);

  // remember=true persists the session across browser restarts (localStorage);
  // remember=false keeps it only for this browser tab/session (sessionStorage).
  const login = async (email, password, remember = true) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.user.role !== 'admin') {
      throw { response: { data: { message: 'This account does not have admin access' } } };
    }
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_token');
    (remember ? localStorage : sessionStorage).setItem('admin_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
