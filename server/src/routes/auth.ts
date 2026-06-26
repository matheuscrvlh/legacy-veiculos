import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { env } from '../config/env';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

interface UsuarioRow { id: number; usuario: string; created_at: string; }

function q<T>(sql: string) {
  return db.prepare(sql) as unknown as {
    get: (...a: unknown[]) => T | undefined;
    all: (...a: unknown[]) => T[];
    run: (...a: unknown[]) => void;
  };
}

router.get('/usuarios', authMiddleware, (_req: Request, res: Response) => {
  const rows = q<UsuarioRow>('SELECT id, usuario, created_at FROM usuarios ORDER BY id ASC').all();
  res.json(rows);
});

router.post('/usuarios', authMiddleware, (req: Request, res: Response) => {
  const { usuario, senha } = req.body as { usuario: string; senha: string };
  if (!usuario || !senha) {
    res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    return;
  }
  const existe = q<{ id: number }>('SELECT id FROM usuarios WHERE usuario = ?').get(usuario);
  if (existe) {
    res.status(409).json({ message: 'Usuário já existe.' });
    return;
  }
  const hash = bcrypt.hashSync(senha, 10);
  q('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)').run(usuario, hash);
  res.status(201).json({ message: 'Usuário criado com sucesso.' });
});

router.put('/usuarios/:id', authMiddleware, (req: Request, res: Response) => {
  const { senha } = req.body as { senha: string };
  if (!senha) {
    res.status(400).json({ message: 'Nova senha é obrigatória.' });
    return;
  }
  const user = q<{ id: number }>('SELECT id FROM usuarios WHERE id = ?').get(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }
  const hash = bcrypt.hashSync(senha, 10);
  q('UPDATE usuarios SET senha = ? WHERE id = ?').run(hash, req.params.id);
  res.json({ message: 'Senha atualizada com sucesso.' });
});

router.delete('/usuarios/:id', authMiddleware, (req: Request, res: Response) => {
  const total = q<{ n: number }>('SELECT COUNT(*) as n FROM usuarios').get()?.n ?? 0;
  if (total <= 1) {
    res.status(400).json({ message: 'Não é possível remover o último usuário.' });
    return;
  }
  const user = q<{ id: number }>('SELECT id FROM usuarios WHERE id = ?').get(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }
  q('DELETE FROM usuarios WHERE id = ?').run(req.params.id);
  res.json({ message: 'Usuário removido.' });
});

router.post('/login', (req: Request, res: Response) => {
  const { usuario, senha } = req.body as { usuario: string; senha: string };

  if (!usuario || !senha) {
    res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    return;
  }

  const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario) as
    | { id: number; usuario: string; senha: string }
    | undefined;

  if (!user || !bcrypt.compareSync(senha, user.senha)) {
    res.status(401).json({ message: 'Usuário ou Senha inválidos.' });
    return;
  }

  const token = jwt.sign({ userId: user.id, usuario: user.usuario }, env.JWT_SECRET, {
    expiresIn: '8h',
  } as jwt.SignOptions);

  res.json({ token, usuario: user.usuario });
});

router.post('/verificar', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
