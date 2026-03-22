// Interface Role (correspond à Role.java)
export interface Role {
  id: number;
  nomRole: string;
}


// Interface Utilisateur (correspond à User.java)
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  username?: string;
  password?: string;
  /** Rôle (JSON API après fix backend) */
  role?: Role | null;
  /** Ancien nom côté API Java si présent sans @JsonProperty */
  roleDto?: Role | null;
}

/** Libellé du rôle pour l'affichage (tableau dashboard, etc.) */
export function getUserRoleLabel(u: User): string {
  const r = u.role ?? u.roleDto;
  const name = r?.nomRole?.trim();
  return name && name.length > 0 ? name : 'Aucun';
}

// DTO pour créer un user (sans id)
export interface CreateUserDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;  // Obligatoire, pas de ?
  role: {
    id: number;  // Seulement l'ID du rôle
};
}

// DTO pour mettre à jour un utilisateur
export interface UpdateUserDTO {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  password?: string;
  role?: {
    id: number;
  };
}