import { useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { getToken, setToken, removeToken } from '../lib/utils';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.verificar()
      .then((r) => setIsLoggedIn(r.valid))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(usuario: string, senha: string) {
    const data = await authApi.login(usuario, senha);
    setToken(data.token);
    setIsLoggedIn(true);
    return data;
  }

  function logout() {
    removeToken();
    setIsLoggedIn(false);
  }

  return { isLoggedIn, loading, login, logout };
}
