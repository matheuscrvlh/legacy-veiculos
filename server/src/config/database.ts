import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(__dirname, '../../data/database.sqlite');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS veiculos (
    id TEXT PRIMARY KEY,
    codigo_sequencial INTEGER,
    nome TEXT,
    modelo TEXT,
    marca TEXT,
    categoria TEXT,
    combustivel TEXT,
    cambio TEXT,
    cor TEXT,
    portas INTEGER,
    km INTEGER,
    sobre TEXT,
    opcionais TEXT,
    ano INTEGER,
    valor TEXT,
    tipo_veiculo TEXT,
    imagens TEXT DEFAULT '[]',
    oferta INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vendidos (
    id TEXT PRIMARY KEY,
    codigo_sequencial INTEGER,
    nome TEXT,
    modelo TEXT,
    marca TEXT,
    categoria TEXT,
    combustivel TEXT,
    cambio TEXT,
    cor TEXT,
    portas INTEGER,
    km INTEGER,
    sobre TEXT,
    opcionais TEXT,
    ano INTEGER,
    valor TEXT,
    tipo_veiculo TEXT,
    imagens TEXT DEFAULT '[]',
    oferta INTEGER DEFAULT 0,
    vendido_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nome TEXT,
    marca TEXT,
    categoria TEXT,
    combustivel TEXT,
    cambio TEXT,
    cor TEXT,
    portas INTEGER,
    km INTEGER,
    ano INTEGER,
    valor_fipe TEXT,
    valor_desejado TEXT,
    placa TEXT,
    cidade TEXT,
    bairro TEXT,
    observacao TEXT,
    leilao TEXT,
    info_leilao TEXT,
    anuncio TEXT,
    info_anuncio TEXT,
    gnv TEXT,
    info_gnv TEXT,
    nome_cliente TEXT,
    email_cliente TEXT,
    telefone_cliente TEXT,
    imagens TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sobre (
    id INTEGER PRIMARY KEY DEFAULT 1,
    dados TEXT DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS codigo_sequencial (
    id INTEGER PRIMARY KEY DEFAULT 1,
    ultimo_codigo INTEGER DEFAULT 3000
  );
`);

const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASSWORD;
if (adminUser && adminPass) {
  const adminExiste = db.prepare('SELECT id FROM usuarios WHERE usuario = ?').get(adminUser) as { id: number } | undefined;
  if (!adminExiste) {
    const hash = bcrypt.hashSync(adminPass, 10);
    db.prepare('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)').run(adminUser, hash);
  }
}

const codigoExiste = db.prepare('SELECT id FROM codigo_sequencial WHERE id = 1').get() as { id: number } | undefined;
if (!codigoExiste) {
  db.prepare('INSERT INTO codigo_sequencial (id, ultimo_codigo) VALUES (1, 3000)').run();
}

const sobreExiste = db.prepare('SELECT id FROM sobre WHERE id = 1').get() as { id: number } | undefined;
if (!sobreExiste) {
  db.prepare('INSERT INTO sobre (id, dados) VALUES (1, ?)').run(JSON.stringify({}));
}

export default db;
