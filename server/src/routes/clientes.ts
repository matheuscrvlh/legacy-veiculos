import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { authMiddleware } from '../middlewares/auth';
import { clientStorage, deleteFile, getClienteImagePath } from '../utils/imageUtils';

const router = Router();
const upload = multer({ storage: clientStorage, limits: { fileSize: 10 * 1024 * 1024 } }).array('imagens', 10);

interface ClienteRow {
  id: string; nome: string; marca: string; categoria: string; combustivel: string;
  cambio: string; cor: string; portas: number; km: number; ano: number;
  valor_fipe: string; valor_desejado: string; placa: string; cidade: string;
  bairro: string; observacao: string; leilao: string; info_leilao: string;
  anuncio: string; info_anuncio: string; gnv: string; info_gnv: string;
  nome_cliente: string; email_cliente: string; telefone_cliente: string; imagens: string;
}

function parseCliente(row: ClienteRow) {
  return {
    ID: row.id, Nome: row.nome, Marca: row.marca, Categoria: row.categoria,
    Combustivel: row.combustivel, Cambio: row.cambio, Cor: row.cor,
    Portas: row.portas, Km: row.km, Ano: row.ano, ValorFipe: row.valor_fipe,
    ValorDesejado: row.valor_desejado, Placa: row.placa, Cidade: row.cidade,
    Bairro: row.bairro, Observacao: row.observacao, Leilao: row.leilao,
    InfoLeilao: row.info_leilao, Anuncio: row.anuncio, InfoAnuncio: row.info_anuncio,
    Gnv: row.gnv, InfoGnv: row.info_gnv, NomeCliente: row.nome_cliente,
    EmailCliente: row.email_cliente, TelefoneCliente: row.telefone_cliente,
    Imagens: JSON.parse(row.imagens || '[]') as string[],
  };
}

function q<T>(sql: string) { return db.prepare(sql) as unknown as { get: (...a: unknown[]) => T | undefined; all: (...a: unknown[]) => T[]; run: (...a: unknown[]) => void; }; }

router.post('/enviar-consignado', (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) { res.status(500).json({ message: 'Erro no upload.' }); return; }

    const { nome, marca, categoria, combustivel, cambio, cor, portas, km, ano,
      valorFipe, valorDesejado, placa, cidade, bairro, observacao,
      leilao, infoLeilao, anuncio, infoAnuncio, gnv, infoGnv,
      nomeCliente, emailCliente, telefoneCliente } = req.body as Record<string, string>;

    const files = req.files as Express.Multer.File[];

    if (!nome || !marca || !nomeCliente || !emailCliente || !telefoneCliente || files.length === 0) {
      res.status(400).json({ message: 'Campos obrigatórios faltando.' }); return;
    }

    const cliente = {
      id: uuidv4(), nome, marca, categoria, combustivel, cambio, cor,
      portas: parseInt(portas) || 0, km: parseInt(km) || 0, ano: parseInt(ano) || 0,
      valor_fipe: valorFipe || '', valor_desejado: valorDesejado || '',
      placa: placa || '', cidade: cidade || '', bairro: bairro || '',
      observacao: observacao || '', leilao: leilao || '', info_leilao: infoLeilao || '',
      anuncio: anuncio || '', info_anuncio: infoAnuncio || '',
      gnv: gnv || '', info_gnv: infoGnv || '',
      nome_cliente: nomeCliente, email_cliente: emailCliente, telefone_cliente: telefoneCliente,
      imagens: JSON.stringify(files.map((f) => f.filename)),
    };

    q(`INSERT INTO clientes (id, nome, marca, categoria, combustivel, cambio, cor, portas, km, ano, valor_fipe, valor_desejado, placa, cidade, bairro, observacao, leilao, info_leilao, anuncio, info_anuncio, gnv, info_gnv, nome_cliente, email_cliente, telefone_cliente, imagens) VALUES (@id, @nome, @marca, @categoria, @combustivel, @cambio, @cor, @portas, @km, @ano, @valor_fipe, @valor_desejado, @placa, @cidade, @bairro, @observacao, @leilao, @info_leilao, @anuncio, @info_anuncio, @gnv, @info_gnv, @nome_cliente, @email_cliente, @telefone_cliente, @imagens)`).run(cliente);

    res.status(200).json(parseCliente(cliente as unknown as ClienteRow));
  });
});

router.get('/', authMiddleware, (_req: Request, res: Response) => {
  const rows = q<ClienteRow>('SELECT * FROM clientes ORDER BY created_at DESC').all();
  res.json(rows.map(parseCliente));
});

router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<ClienteRow>('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Cliente não encontrado.' }); return; }
  res.json(parseCliente(row));
});

router.delete('/remover/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<ClienteRow>('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }
  (JSON.parse(row.imagens || '[]') as string[]).forEach((img) => deleteFile(getClienteImagePath(img)));
  q('DELETE FROM clientes WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Veículo removido com sucesso!' });
});

export default router;
