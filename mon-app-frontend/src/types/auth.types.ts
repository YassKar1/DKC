// Requête de login (ce qu'on envoie au backend)
export interface LoginRequest {
  username: string;
  password: string;
}

// Réponse du backend après login réussi
export interface LoginResponse {
  token: string;
}

// Requête d'inscription (le backend attribue toujours le rôle USER)
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  username: string;
  password: string;
}

// Données décodées du JWT token
export interface DecodedToken {
  sub: string;        // username
  roles: string[];    // ["ROLE_ADMIN", "ROLE_USER"]
  exp: number;        // timestamp d'expiration (en secondes)
}