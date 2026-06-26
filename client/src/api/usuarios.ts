import api from './client';

export interface Usuario {
  id: number;
  usuario: string;
  created_at: string;
}

export const usuariosApi = {
  listar: () => api.get<Usuario[]>('/auth/usuarios').then((r) => r.data),

  criar: (usuario: string, senha: string) =>
    api.post('/auth/usuarios', { usuario, senha }).then((r) => r.data),

  atualizarSenha: (id: number, senha: string) =>
    api.put(`/auth/usuarios/${id}`, { senha }).then((r) => r.data),

  remover: (id: number) =>
    api.delete(`/auth/usuarios/${id}`).then((r) => r.data),
};
