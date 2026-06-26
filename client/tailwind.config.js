/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaria: 'var(--cor-primaria)',
        secundaria: 'var(--cor-secundaria)',
        botao: 'var(--cor-botao)',
        hover: 'var(--cor-hover)',
        active: 'var(--cor-active)',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
