import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';

const AuthContext = createContext();

const storageKey = 'gastocerto_session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  });

  const [user, setUser] = useState(() => session?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem(storageKey, JSON.stringify(session));
      setUser(session.user);
    } else {
      localStorage.removeItem(storageKey);
      setUser(null);
    }
  }, [session]);

  const authenticate = async (path, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(path, { method: 'POST', body: payload });
      setSession({ accessToken: data.session.access_token, user: data.user });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token: session?.accessToken ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      loading,
      error,
      login: (payload) => authenticate('/api/auth/login', payload),
      register: (payload) => authenticate('/api/auth/register', payload),
      logout: () => setSession(null),
    }),
    [session, user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);



