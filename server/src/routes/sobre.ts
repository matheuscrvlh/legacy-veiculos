import { Router, Request, Response } from 'express';
import multer from 'multer';
import db from '../config/database';
import { authMiddleware } from '../middlewares/auth';
import { sobreStorage, imageMimeFilter, deleteFile, getUploadsFilePath } from '../utils/imageUtils';

const router = Router();

const uploadSobre = multer({
  storage: sobreStorage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: imageMimeFilter,
}).fields([
  { name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 },
  { name: 'imagemEmpresa', maxCount: 10 }, { name: 'imagemDestaque', maxCount: 10 },
  { name: 'imagemSobre1', maxCount: 1 }, { name: 'imagemSobre2', maxCount: 1 },
  { name: 'imagemIconeInstagram', maxCount: 1 },
  { name: 'imagemUmaInstagram', maxCount: 1 }, { name: 'imagemDuasInstagram', maxCount: 1 },
  { name: 'imagemTresInstagram', maxCount: 1 }, { name: 'imagemQuatroInstagram', maxCount: 1 },
  { name: 'imagemCincoInstagram', maxCount: 1 }, { name: 'imagemSeisInstagram', maxCount: 1 },
]);

function q<T>(sql: string) { return db.prepare(sql) as unknown as { get: (...a: unknown[]) => T | undefined; run: (...a: unknown[]) => void; }; }

router.get('/dados-sobre', (_req: Request, res: Response) => {
  const row = q<{ dados: string }>('SELECT dados FROM sobre WHERE id = 1').get();
  res.json(row ? JSON.parse(row.dados || '{}') : {});
});

router.post('/salvar', authMiddleware, (req: Request, res: Response) => {
  uploadSobre(req, res, (err) => {
    if (err) { res.status(500).json({ message: 'Erro no upload: ' + String(err) }); return; }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const body = req.body as Record<string, string>;

    const oldRow = q<{ dados: string }>('SELECT dados FROM sobre WHERE id = 1').get();
    const dadosAntigos = oldRow ? JSON.parse(oldRow.dados || '{}') as Record<string, unknown> : {};
    const dados = JSON.parse(JSON.stringify(dadosAntigos)) as Record<string, unknown>;

    dados.empresa = { nomeEmpresa: body.nomeEmpresa || '' };

    const imagens = (dados.imagens || {}) as Record<string, unknown>;
    if (files['logo']) imagens.logo = files['logo'][0].filename;
    if (files['favicon']) imagens.favicon = files['favicon'][0].filename;
    if (files['imagemEmpresa']) imagens.imagemEmpresa = files['imagemEmpresa'].map((f) => f.filename);
    if (files['imagemDestaque']) imagens.imagemDestaque = files['imagemDestaque'].map((f) => f.filename);
    if (files['imagemSobre1']) imagens.imagemSobre1 = files['imagemSobre1'][0].filename;
    if (files['imagemSobre2']) imagens.imagemSobre2 = files['imagemSobre2'][0].filename;
    dados.imagens = imagens;

    dados.cores = {
      corPrimaria: body.corPrimaria || '', corSecundaria: body.corSecundaria || '',
      corBotao: body.corBotao || '', corHover: body.corHover || '', corActive: body.corActive || '',
    };
    dados.sobre = { texto1: body.sobreTexto1 || '', texto2: body.sobreTexto2 || '' };
    dados.whatsapp = { numero: body.whatsappNumero || '', link: body.whatsappLink || '' };
    dados.instagram = { nome: body.instagramNome || '', link: body.instagramLink || '' };
    dados.facebook = { nome: body.facebookNome || '', link: body.facebookLink || '' };

    const igAntigo = dadosAntigos.instagramLoja as Record<string, unknown> | undefined;
    const feedAntigo = (igAntigo?.feed || {}) as Record<string, string>;

    dados.instagramLoja = {
      id: body.idInstagramLoja || '', nome: body.nomeInstagramLoja || '',
      seguidores: body.seguidoresInstagramLoja || '', publicacoes: body.publiInstagramLoja || '',
      icone: files['imagemIconeInstagram'] ? files['imagemIconeInstagram'][0].filename : (igAntigo?.icone || ''),
      feed: {
        imagem1: files['imagemUmaInstagram'] ? files['imagemUmaInstagram'][0].filename : (feedAntigo.imagem1 || ''),
        imagem2: files['imagemDuasInstagram'] ? files['imagemDuasInstagram'][0].filename : (feedAntigo.imagem2 || ''),
        imagem3: files['imagemTresInstagram'] ? files['imagemTresInstagram'][0].filename : (feedAntigo.imagem3 || ''),
        imagem4: files['imagemQuatroInstagram'] ? files['imagemQuatroInstagram'][0].filename : (feedAntigo.imagem4 || ''),
        imagem5: files['imagemCincoInstagram'] ? files['imagemCincoInstagram'][0].filename : (feedAntigo.imagem5 || ''),
        imagem6: files['imagemSeisInstagram'] ? files['imagemSeisInstagram'][0].filename : (feedAntigo.imagem6 || ''),
      },
    };

    dados.localizacao = { endereco: body.endereco || '', horario: body.horario || '', mapa: body.mapa || '' };
    dados.rodape = body.rodape || '';
    dados.fraseTopbar = body.fraseTopbar || '';

    // Deletar imagens antigas substituídas
    const imgAntigos = dadosAntigos.imagens as Record<string, string> | undefined;
    const imgNovos = dados.imagens as Record<string, string>;
    [
      { campo: 'logo', pasta: 'logos' }, { campo: 'favicon', pasta: 'icons' },
      { campo: 'imagemSobre1', pasta: 'bannersAbout' }, { campo: 'imagemSobre2', pasta: 'bannersAbout' },
    ].forEach(({ campo, pasta }) => {
      const novo = imgNovos[campo]; const antigo = imgAntigos?.[campo];
      if (novo && antigo && novo !== antigo) deleteFile(getUploadsFilePath(pasta, antigo));
    });

    if (files['imagemIconeInstagram'] && igAntigo?.icone) {
      deleteFile(getUploadsFilePath('bannersInstagram', igAntigo.icone as string));
    }

    q('UPDATE sobre SET dados = ? WHERE id = 1').run(JSON.stringify(dados));
    res.json({ mensagem: 'Dados salvos com sucesso!' });
  });
});

export default router;
