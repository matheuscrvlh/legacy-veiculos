import api from './client';

export const authApi = {
  login: (usuario: string, senha: string) =>
    api.post<{ token: string; usuario: string }>('/auth/login', { usuario, senha }).then((r) => r.data),

  verificar: () =>
    api.post<{ valid: boolean }>('/auth/verificar').then((r) => r.data),
};
