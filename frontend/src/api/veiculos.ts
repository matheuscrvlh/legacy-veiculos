import api from './client';
import { Veiculo } from '../types';

export const veiculosApi = {
  listar: () => api.get<Veiculo[]>('/veiculos').then((r) => r.data),
  listarOferta: () => api.get<Veiculo[]>('/veiculos/oferta').then((r) => r.data),
  buscarPorId: (id: string) => api.get<Veiculo>(`/veiculos/${id}`).then((r) => r.data),

  adicionar: (formData: FormData) =>
    api.post('/veiculos/adicionar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  remover: (id: string) => api.delete(`/veiculos/remover/${id}`).then((r) => r.data),

  toggleOferta: (id: string) => api.post(`/veiculos/oferta/${id}`).then((r) => r.data),

  marcarVendido: (id: string) => api.post(`/veiculos/marcar-vendido/${id}`).then((r) => r.data),
};
