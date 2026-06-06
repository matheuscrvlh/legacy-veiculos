import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { authMiddleware } from '../middlewares/auth';
import { vehicleStorage, deleteFile, moveFile, getVehicleImagePath, getSoldVehicleImagePath } from '../utils/imageUtils';

const router = Router();
const upload = multer({ storage: vehicleStorage, limits: { fileSize: 15 * 1024 * 1024 } }).array('imagens', 10);

interface VeiculoRow {
  id: string; codigo_sequencial: number; nome: string; modelo: string;
  marca: string; categoria: string; combustivel: string; cambio: string;
  cor: string; portas: number; km: number; sobre: string; opcionais: string;
  ano: number; valor: string; tipo_veiculo: string; imagens: string; oferta: number;
}

function parseVeiculo(row: VeiculoRow) {
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
  const rows = q<VeiculoRow>('SELECT * FROM veiculos ORDER BY created_at DESC').all();
  res.json(rows.map(parseVeiculo));
});

router.get('/oferta', (_req: Request, res: Response) => {
  const rows = q<VeiculoRow>('SELECT * FROM veiculos WHERE oferta = 1 ORDER BY created_at DESC').all();
  res.json(rows.map(parseVeiculo));
});

router.get('/:id', (req: Request, res: Response) => {
  const row = q<VeiculoRow>('SELECT * FROM veiculos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }
  res.json(parseVeiculo(row));
});

router.post('/adicionar', authMiddleware, (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) { res.status(500).json({ message: 'Erro no upload.' }); return; }

    const codigoRow = q<{ ultimo_codigo: number }>('SELECT ultimo_codigo FROM codigo_sequencial WHERE id = 1').get();
    const novoCodigo = (codigoRow?.ultimo_codigo ?? 3000) + 1;

    const files = req.files as Express.Multer.File[];
    const imagens = JSON.stringify(files.map((f) => f.filename));

    const veiculo = {
      id: uuidv4(), codigo_sequencial: novoCodigo,
      nome: req.body.nome || '', modelo: req.body.modelo || '',
      marca: req.body.marca || '', categoria: req.body.categoria || '',
      combustivel: req.body.combustivel || '', cambio: req.body.cambio || '',
      cor: req.body.cor || '', portas: parseInt(req.body.portas) || 0,
      km: parseInt(req.body.km) || 0, sobre: req.body.sobre || '',
      opcionais: req.body.opcionais || '', ano: parseInt(req.body.ano) || 0,
      valor: req.body.valor || '', tipo_veiculo: req.body.tipoVeiculo || '',
      imagens, oferta: 0,
    };

    q(`INSERT INTO veiculos (id, codigo_sequencial, nome, modelo, marca, categoria, combustivel, cambio, cor, portas, km, sobre, opcionais, ano, valor, tipo_veiculo, imagens, oferta) VALUES (@id, @codigo_sequencial, @nome, @modelo, @marca, @categoria, @combustivel, @cambio, @cor, @portas, @km, @sobre, @opcionais, @ano, @valor, @tipo_veiculo, @imagens, @oferta)`).run(veiculo);
    q('UPDATE codigo_sequencial SET ultimo_codigo = ? WHERE id = 1').run(novoCodigo);

    res.json({ message: 'Veículo adicionado com sucesso!' });
  });
});

router.delete('/remover/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<VeiculoRow>('SELECT * FROM veiculos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }

  (JSON.parse(row.imagens || '[]') as string[]).forEach((img) => deleteFile(getVehicleImagePath(img)));
  q('DELETE FROM veiculos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Veículo removido com sucesso!' });
});

router.post('/oferta/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<{ oferta: number }>('SELECT oferta FROM veiculos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }
  const novo = row.oferta === 1 ? 0 : 1;
  q('UPDATE veiculos SET oferta = ? WHERE id = ?').run(novo, req.params.id);
  res.json({ Oferta: novo === 1 });
});

router.put('/editar/:id', authMiddleware, (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) { res.status(500).json({ message: 'Erro no upload.' }); return; }

    const row = q<VeiculoRow>('SELECT * FROM veiculos WHERE id = ?').get(req.params.id);
    if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }

    const imagensExistentes: string[] = JSON.parse(req.body.imagensExistentes || '[]');
    const imagensAtuais: string[] = JSON.parse(row.imagens || '[]');

    imagensAtuais
      .filter((img) => !imagensExistentes.includes(img))
      .forEach((img) => deleteFile(getVehicleImagePath(img)));

    const novasImagens = (req.files as Express.Multer.File[]).map((f) => f.filename);
    const imagensFinais = JSON.stringify([...imagensExistentes, ...novasImagens]);

    q(`UPDATE veiculos SET nome=@nome, modelo=@modelo, marca=@marca, categoria=@categoria, combustivel=@combustivel, cambio=@cambio, cor=@cor, portas=@portas, km=@km, sobre=@sobre, opcionais=@opcionais, ano=@ano, valor=@valor, tipo_veiculo=@tipo_veiculo, imagens=@imagens WHERE id=@id`).run({
      id: req.params.id,
      nome: req.body.nome || '', modelo: req.body.modelo || '',
      marca: req.body.marca || '', categoria: req.body.categoria || '',
      combustivel: req.body.combustivel || '', cambio: req.body.cambio || '',
      cor: req.body.cor || '', portas: parseInt(req.body.portas) || 0,
      km: parseInt(req.body.km) || 0, sobre: req.body.sobre || '',
      opcionais: req.body.opcionais || '', ano: parseInt(req.body.ano) || 0,
      valor: req.body.valor || '', tipo_veiculo: req.body.tipoVeiculo || '',
      imagens: imagensFinais,
    });

    res.json({ message: 'Veículo atualizado com sucesso!' });
  });
});

router.post('/marcar-vendido/:id', authMiddleware, (req: Request, res: Response) => {
  const row = q<VeiculoRow>('SELECT * FROM veiculos WHERE id = ?').get(req.params.id);
  if (!row) { res.status(404).json({ message: 'Veículo não encontrado.' }); return; }

  const imagens = JSON.parse(row.imagens || '[]') as string[];
  imagens.forEach((img) => moveFile(getVehicleImagePath(img), getSoldVehicleImagePath(img)));

  q(`INSERT INTO vendidos (id, codigo_sequencial, nome, modelo, marca, categoria, combustivel, cambio, cor, portas, km, sobre, opcionais, ano, valor, tipo_veiculo, imagens, oferta) VALUES (@id, @codigo_sequencial, @nome, @modelo, @marca, @categoria, @combustivel, @cambio, @cor, @portas, @km, @sobre, @opcionais, @ano, @valor, @tipo_veiculo, @imagens, @oferta)`).run(row);
  q('DELETE FROM veiculos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Veículo marcado como vendido.' });
});

export default router;
