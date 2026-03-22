export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
console.log('API URL:', API_BASE_URL);
console.log(import.meta);

// Endpoints de l'API
export const API_ENDPOINTS = {
// Authentification
LOGIN: '/api/auth/login',
// Utilisateurs
USERS: '/api/user',
USER_BY_ID: (id: number) => `/api/user/${id}`,
} as const;

// Clés du localStorage
export const STORAGE_KEYS = {
TOKEN: 'auth_token',
USER: 'user_data',
} as const;

// Configuration JWT
export const JWT_CONFIG = {
HEADER_NAME: 'Authorization',
TOKEN_PREFIX: 'Bearer ',
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
NETWORK_ERROR: 'Erreur de connexion au serveur',
INVALID_CREDENTIALS: 'Identifiants incorrects',
UNAUTHORIZED: 'Accès non autorisé',
SERVER_ERROR: 'Erreur serveur',
TOKEN_EXPIRED: 'Session expirée, veuillez vous reconnecter',
EMAIL_EXISTS: 'Cet email est déjà utilisé',
PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
REQUIRED_FIELD: 'Ce champ est obligatoire',
} as const;