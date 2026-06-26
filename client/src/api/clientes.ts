import api from './client';
import { Cliente } from '../types';

export const clientesApi = {
  enviarConsignado: (formData: FormData) =>
    api.post<Cliente>('/clientes/enviar-consignado', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  listar: () => api.get<Cliente[]>('/clientes').then((r) => r.data),
  buscarPorId: (id: string) => api.get<Cliente>(`/clientes/${id}`).then((r) => r.data),
  remover: (id: string) => api.delete(`/clientes/remover/${id}`).then((r) => r.data),
};
