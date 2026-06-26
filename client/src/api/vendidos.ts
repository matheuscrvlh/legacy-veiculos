import api from './client';
import { Veiculo } from '../types';

export const vendidosApi = {
  listar: () => api.get<Veiculo[]>('/vendidos').then((r) => r.data),
  buscarPorId: (id: string) => api.get<Veiculo>(`/vendidos/${id}`).then((r) => r.data),
  remover: (id: string) => api.delete(`/vendidos/remover/${id}`).then((r) => r.data),
  reativar: (id: string) => api.post(`/vendidos/reativar/${id}`).then((r) => r.data),
};
