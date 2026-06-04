import api from './client';
import { SobreDados } from '../types';

export const sobreApi = {
  getDados: () => api.get<SobreDados>('/dados-sobre').then((r) => r.data),

  salvar: (formData: FormData) =>
    api.post('/salvar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
};
