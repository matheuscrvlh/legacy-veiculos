import fs from 'fs';
import path from 'path';
import multer from 'multer';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(UPLOADS_DIR);

function makeFilename(_req: Express.Request, file: Express.Multer.File, cb: (err: null, name: string) => void) {
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  cb(null, name);
}

export const vehicleStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_DIR, 'vehicles');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: makeFilename,
});

export const soldVehicleStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_DIR, 'vehiclesSold');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: makeFilename,
});

export const clientStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_DIR, 'clientes');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: makeFilename,
});

export const sobreStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const pastaMap: Record<string, string> = {
      logo: 'logos',
      favicon: 'icons',
      imagemEmpresa: 'bannersAbout',
      imagemDestaque: 'bannersMain',
      imagemSobre1: 'bannersAbout',
      imagemSobre2: 'bannersAbout',
      imagemIconeInstagram: 'bannersInstagram',
      imagemUmaInstagram: 'bannersInstagram',
      imagemDuasInstagram: 'bannersInstagram',
      imagemTresInstagram: 'bannersInstagram',
      imagemQuatroInstagram: 'bannersInstagram',
      imagemCincoInstagram: 'bannersInstagram',
      imagemSeisInstagram: 'bannersInstagram',
    };
    const subpasta = pastaMap[file.fieldname] || 'outros';
    const dir = path.join(UPLOADS_DIR, subpasta);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: makeFilename,
});

export const imageMimeFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido.'));
  }
};

export function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function moveFile(src: string, dest: string) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.renameSync(src, dest);
  }
}

export function getVehicleImagePath(filename: string) {
  return path.join(UPLOADS_DIR, 'vehicles', filename);
}

export function getSoldVehicleImagePath(filename: string) {
  return path.join(UPLOADS_DIR, 'vehiclesSold', filename);
}

export function getClienteImagePath(filename: string) {
  return path.join(UPLOADS_DIR, 'clientes', filename);
}

export function getUploadsFilePath(subfolder: string, filename: string) {
  return path.join(UPLOADS_DIR, subfolder, filename);
}
