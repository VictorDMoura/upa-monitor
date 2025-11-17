import { API_BASE_URL as ENV_API_BASE_URL, OAUTH_CLIENT_ID as ENV_CLIENT_ID, OAUTH_CLIENT_SECRET as ENV_CLIENT_SECRET, OAUTH_USERNAME as ENV_USERNAME, OAUTH_PASSWORD as ENV_PASSWORD } from '@env';
export const API_BASE_URL = ENV_API_BASE_URL;
export const OAUTH_CLIENT_ID = ENV_CLIENT_ID;
export const OAUTH_CLIENT_SECRET = ENV_CLIENT_SECRET;
export const OAUTH_USERNAME = ENV_USERNAME;
export const OAUTH_PASSWORD = ENV_PASSWORD;
export const API_URL = `${API_BASE_URL}/api`;
export const USE_API = true;

// Cores do tema
export const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  white: '#ffffff',
  black: '#1f2937',
};

// Status de tempo de espera
export const TEMPO_STATUS = {
  RAPIDO: 30,
  MODERADO: 60,
};

// Função para obter cor baseada no tempo
export const getTempoColor = (tempo) => {
  if (tempo < TEMPO_STATUS.RAPIDO) return COLORS.success;
  if (tempo < TEMPO_STATUS.MODERADO) return COLORS.warning;
  return COLORS.danger;
};