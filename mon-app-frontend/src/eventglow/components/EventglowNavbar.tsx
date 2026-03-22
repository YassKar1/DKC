import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, LogIn, Plus, Shield, User, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

export default function EventglowNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");

  const navLinks = [
    { to: "/events", label: "Découvrir" },
    { to: "/events/create", label: "Créer" },
  ];

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 glass-thin">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-2 md:gap-4">
        <Link to="/events" className="text-lg md:text-xl font-bold tracking-tight text-foreground shrink-0">
          Event<span className="text-primary">DKC</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap justify-end">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Local</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-end">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs md:text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
              <Link
                to="/reservations"
                className={`flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  location.pathname === "/reservations"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground glass-thin"
                }`}
              >
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Mes réservations</span>
              </Link>
              {!isAdmin && (
                <Link
                  to="/profile"
                  className={`flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                    location.pathname === "/profile"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground glass-thin"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Profil</span>
                </Link>
              )}
              <Link
                to="/events/create"
                className="flex items-center gap-1.5 px-2 md:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Créer</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              type="button"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Connexion</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
