export function formatarValor(valor: string | number): string {
  const num = typeof valor === 'string' ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) : valor;
  if (isNaN(num)) return String(valor);
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatarKm(km: number): string {
  return km.toLocaleString('pt-BR');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
