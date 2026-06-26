import { createPortal } from 'react-dom';

interface Props {
  msg?: string;
  erro?: string;
}

export default function AdminToast({ msg, erro }: Props) {
  const text = erro || msg;
  if (!text) return null;

  const isErro = !!erro;

  return createPortal(
    <div
      className={`fixed top-5 right-5 z-[9999] toast-slide-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white max-w-[340px] pointer-events-none ${
        isErro ? 'bg-red-500' : 'bg-emerald-500'
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold leading-none">
        {isErro ? '✕' : '✓'}
      </span>
      <span className="leading-snug">{text}</span>
    </div>,
    document.body
  );
}
