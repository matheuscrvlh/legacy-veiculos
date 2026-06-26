import { useState, useEffect } from 'react';
import { sobreApi } from '../api/sobre';
import { SobreDados } from '../types';

let sobreCache: SobreDados | null = null;
const listeners: Array<(data: SobreDados) => void> = [];

function notifyListeners(data: SobreDados) {
  sobreCache = data;
  listeners.forEach((l) => l(data));
}

export function useSobre() {
  const [dados, setDados] = useState<SobreDados>(sobreCache ?? {});
  const [loading, setLoading] = useState(!sobreCache);

  useEffect(() => {
    listeners.push(setDados);

    if (!sobreCache) {
      sobreApi.getDados().then((data) => {
        notifyListeners(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      const idx = listeners.indexOf(setDados);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  useEffect(() => {
    if (!dados.cores) return;
    const root = document.documentElement;
    root.style.setProperty('--cor-primaria', dados.cores.corPrimaria || '#000000');
    root.style.setProperty('--cor-secundaria', dados.cores.corSecundaria || '#000000');
    root.style.setProperty('--cor-botao', dados.cores.corBotao || '#000000');
    root.style.setProperty('--cor-hover', dados.cores.corHover || '#000000');
    root.style.setProperty('--cor-active', dados.cores.corActive || '#000000');

    if (dados.empresa?.nomeEmpresa) {
      document.title = dados.empresa.nomeEmpresa;
    }

    if (dados.imagens?.favicon) {
      const link = document.getElementById('faviconLink') as HTMLLinkElement | null;
      if (link) link.href = `/uploads/icons/${dados.imagens.favicon}`;
    }
  }, [dados]);

  return { dados, loading };
}

export function invalidateSobre() {
  sobreCache = null;
  sobreApi.getDados().then(notifyListeners);
}
