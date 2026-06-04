import express from 'express';
import cors from 'cors';
import path from 'path';
import './config/database';
import { env } from './config/env';

import authRoutes from './routes/auth';
import veiculosRoutes from './routes/veiculos';
import vendidosRoutes from './routes/vendidos';
import clientesRoutes from './routes/clientes';
import sobreRoutes from './routes/sobre';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOADS_DIR = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculosRoutes);
app.use('/api/vendidos', vendidosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', sobreRoutes);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
});
