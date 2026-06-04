import { Router, Request, Response } from 'express';
import db from '../config/database';
import { authMiddleware } from '../middlewares/auth';
import { deleteFile, moveFile, getVehicleImagePath, getSoldVehicleImagePath } from '../utils/imageUtils';

const router = Router();

interface VendidoRow {
  id: string; codigo_sequencial: number; nome: string; modelo: string;
  marca: string; categoria: string; combustivel: string; cambio: string;
  cor: string; portas: number; km: number; sobre: string; opcionais: string;
  ano: number; valor: string; tipo_veiculo: string; imagens: string; oferta: number;
}

function parseVendido(row: VendidoRow) {
  return {
    ID: row.id, CodigoSequencial: row.codigo_sequencial, Nome: row.nome,
    Modelo: row.modelo, Marca: row.marca, Categoria: row.categoria,
    Combustivel: row.combustivel, Cambio: row.cambio, Cor: row.cor,
    Portas: row.portas, Km: row.km, Sobre: row.sobre, Opcionais: row.opcionais,
    Ano: row.ano, Valor: row.valor, TipoVeiculo: row.tipo_veiculo,
    Imagens: JSON.parse(row.imagens || '[]') as string[],
    Oferta: row.oferta === 1,
  };
}

function q<T>(sql: string) { return db.prepare(sql) as unknown as { get: (...a: unknown[]) => T | undefined; all: (...a: unknown[]) => T[]; run: (...a: unknown[]) => void; }; }

router.get('/', (_req: Request, res: Response) => {
  const rows = q<VendidoRow>('SELECT * FROM vendidos ORDER BY vendido_em DESC').all();
  res.json(rows.map(parseVendido));
});

router.get('/:id', (req: Request, res: Response) => {
  const row = q<VendidoRow>('SELECT * FROM vendidos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }
  res.json(parseVendido(row));
});

router.delete('/remover/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<VendidoRow>('SELECT * FROM vendidos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }
  (JSON.parse(row.imagens || '[]') as string[]).forEach((img) => deleteFile(getSoldVehicleImagePath(img)));
  q('DELETE FROM vendidos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Veículo removido com sucesso.' });
});

router.post('/reativar/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<VendidoRow>('SELECT * FROM vendidos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado em vendidos.' }); return; }

  const imagens = JSON.parse(row.imagens || '[]') as string[];
  imagens.forEach((img) => moveFile(getSoldVehicleImagePath(img), getVehicleImagePath(img)));

  q(`INSERT INTO veiculos (id, codigo_sequencial, nome, modelo, marca, categoria, combustivel, cambio, cor, portas, km, sobre, opcionais, ano, valor, tipo_veiculo, imagens, oferta) VALUES (@id, @codigo_sequencial, @nome, @modelo, @marca, @categoria, @combustivel, @cambio, @cor, @portas, @km, @sobre, @opcionais, @ano, @valor, @tipo_veiculo, @imagens, @oferta)`).run(row);
  q('DELETE FROM vendidos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Veículo reativado com sucesso!' });
});

export default router;
