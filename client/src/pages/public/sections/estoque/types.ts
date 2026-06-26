export interface Filtros {
  codigo: string;
  oferta: boolean;
  tipo: string;
  marca: string;
  categoria: string;
  cambio: string;
  combustivel: string;
  cores: string[];
  portas: string[];
  anoMin: number;
  anoMax: number;
  precoMin: number;
  precoMax: number;
  kmMin: number;
  kmMax: number;
  ordem: string;
}

export const ANO_MIN = 1990;
export const ANO_MAX = new Date().getFullYear() + 1;
export const KM_MAX = 500000;

export const filtrosIniciais: Filtros = {
  codigo: '', oferta: false, tipo: 'Todos', marca: 'Todos', categoria: 'Todos',
  cambio: 'Todos', combustivel: 'Todos', cores: [], portas: [],
  anoMin: 0, anoMax: ANO_MAX, precoMin: 0, precoMax: 10000000,
  kmMin: 0, kmMax: KM_MAX, ordem: 'ordenar',
};
