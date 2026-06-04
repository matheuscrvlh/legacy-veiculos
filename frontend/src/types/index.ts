export interface Veiculo {
  ID: string;
  CodigoSequencial: number;
  Nome: string;
  Modelo: string;
  Marca: string;
  Categoria: string;
  Combustivel: string;
  Cambio: string;
  Cor: string;
  Portas: number;
  Km: number;
  Sobre: string;
  Opcionais: string;
  Ano: number;
  Valor: string;
  TipoVeiculo: string;
  Imagens: string[];
  Oferta: boolean;
}

export interface Cliente {
  ID: string;
  Nome: string;
  Marca: string;
  Categoria: string;
  Combustivel: string;
  Cambio: string;
  Cor: string;
  Portas: number;
  Km: number;
  Ano: number;
  ValorFipe: string;
  ValorDesejado: string;
  Placa: string;
  Cidade: string;
  Bairro: string;
  Observacao: string;
  Leilao: string;
  InfoLeilao: string;
  Anuncio: string;
  InfoAnuncio: string;
  Gnv: string;
  InfoGnv: string;
  NomeCliente: string;
  EmailCliente: string;
  TelefoneCliente: string;
  Imagens: string[];
}

export interface SobreDados {
  empresa?: { nomeEmpresa: string };
  imagens?: {
    logo?: string;
    favicon?: string;
    imagemEmpresa?: string[];
    imagemDestaque?: string[];
    imagemSobre1?: string;
    imagemSobre2?: string;
  };
  cores?: {
    corPrimaria: string;
    corSecundaria: string;
    corBotao: string;
    corHover: string;
    corActive: string;
  };
  sobre?: { texto1: string; texto2: string };
  whatsapp?: { numero: string; link: string };
  instagram?: { nome: string; link: string };
  facebook?: { nome: string; link: string };
  instagramLoja?: {
    id: string;
    nome: string;
    seguidores: string;
    publicacoes: string;
    icone: string;
    feed: {
      imagem1: string;
      imagem2: string;
      imagem3: string;
      imagem4: string;
      imagem5: string;
      imagem6: string;
    };
  };
  localizacao?: { endereco: string; horario: string; mapa: string };
  rodape?: string;
}

export interface FiltrosVeiculo {
  marca?: string;
  categoria?: string;
  anoDe?: number;
  anoAte?: number;
  cambio?: string;
  combustivel?: string;
  tipoVeiculo?: string;
  cor?: string[];
  portas?: string[];
  codigo?: string;
  oferta?: boolean;
  preco?: [number, number];
  km?: [number, number];
  ordem?: string;
}
