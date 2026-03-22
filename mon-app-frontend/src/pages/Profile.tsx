import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, LogOut, Mail, Phone, User as UserIcon } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/user.types';
import EventglowNavbar from '../eventglow/components/EventglowNavbar';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiService
      .getCurrentUserProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <EventglowNavbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 max-w-lg">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
          Mon profil
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Vos informations de compte</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted border-t-primary" />
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm ring-1 ring-destructive/30">{error}</div>
        ) : profile ? (
          <>
            <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom d&apos;utilisateur</p>
                <p className="text-lg text-foreground font-medium tabular-nums">
                  {profile.username || authUser?.username || '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prénom</p>
                <p className="text-lg text-foreground flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary shrink-0" />
                  {profile.prenom || '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</p>
                <p className="text-lg text-foreground">{profile.nom || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</p>
                <p className="text-lg text-foreground flex items-start gap-2 break-all">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {profile.email || '—'}
                </p>
              </div>
              {profile.telephone ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Téléphone</p>
                  <p className="text-lg text-foreground flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    {profile.telephone}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              <Link
                to="/reservations"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary/15 text-primary font-semibold ring-1 ring-primary/30 hover:bg-primary/20 transition-colors"
              >
                <CalendarDays className="w-5 h-5" />
                Mes réservations
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-4">Fin de session</p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-semibold bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors ring-1 ring-destructive/40"
              >
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
