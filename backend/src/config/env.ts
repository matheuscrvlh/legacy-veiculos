if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET não definido em produção. Encerrando.');
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'legacy_veiculos_secret_key_2025',
  JWT_EXPIRES_IN: '8h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
