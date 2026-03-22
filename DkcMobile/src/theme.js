/**
 * Thème aligné sur mon-app-frontend (Eventglow / Tailwind)
 * Boutons : primaire (indigo), secondaire (contour), danger
 */
export const colors = {
  background: "#020617",
  foreground: "#f8fafc",
  /** Indigo — boutons principaux, liens */
  primary: "#6366f1",
  primaryForeground: "#ffffff",
  /** Variantes pour boutons outline / ghost */
  primaryMuted: "rgba(99, 102, 241, 0.18)",
  primaryBorder: "rgba(129, 140, 248, 0.45)",
  primaryPressed: "#4f46e5",
  muted: "#94a3b8",
  mutedForeground: "#94a3b8",
  card: "#0f172a",
  cardForeground: "#f8fafc",
  border: "rgba(148, 163, 184, 0.2)",
  /** Panneaux secondaires (cartes, boutons neutres) */
  secondary: "#1e293b",
  secondaryForeground: "#f1f5f9",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  input: "rgba(30, 41, 59, 0.85)",
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 16,
  xl: 24,
};

/** Styles réutilisables pour TouchableOpacity */
export const buttonPresets = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: colors.primaryForeground,
    fontWeight: "700",
    fontSize: 16,
  },
  outline: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: colors.secondaryForeground,
    fontWeight: "600",
    fontSize: 14,
  },
  danger: {
    backgroundColor: colors.destructive,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerText: {
    color: colors.destructiveForeground,
    fontWeight: "700",
    fontSize: 16,
  },
  /** Désinscription / action risquée secondaire */
  dangerOutline: {
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.45)",
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerOutlineText: {
    color: "#f87171",
    fontWeight: "700",
    fontSize: 14,
  },
};
