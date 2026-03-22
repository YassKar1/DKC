import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Home, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { User, getUserRoleLabel } from '../types/user.types';
import type { Evenement } from '../eventglow/lib/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersData, eventsData] = await Promise.all([
        apiService.getAllUser(),
        apiService.getAllEvenements(),
      ]);
      setUsers(usersData);
      setEvents(eventsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      await apiService.deleteUser(id);
      loadDashboard();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteEvent = async (ev: Evenement) => {
    if (
      !confirm(
        `Supprimer l'événement « ${ev.nomEvenement} » ? Les inscriptions associées seront aussi supprimées.`
      )
    ) {
      return;
    }
    try {
      setError('');
      await apiService.deleteEvenement(ev.id);
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la suppression de l’événement');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/80 glass-thin sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Bienvenue, {user?.username} ({user?.roles.join(', ')})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <Home className="w-4 h-4 shrink-0" />
              Accueil
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/90 text-destructive-foreground text-sm font-medium hover:bg-destructive transition-colors ring-1 ring-destructive/40"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Liste des utilisateurs
          </h2>
          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-thin text-foreground text-sm font-medium hover:bg-white/5 transition-colors ring-1 ring-border/60"
          >
            <RefreshCw className="w-4 h-4 text-primary shrink-0" />
            Actualiser
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm ring-1 ring-destructive/30">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div
              className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary"
              aria-hidden
            />
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl overflow-hidden ring-1 ring-border/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-secondary/40">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Prénom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm tabular-nums text-foreground">
                            {u.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{u.nom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{u.prenom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
                              {getUserRoleLabel(u)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-destructive hover:text-destructive/80 underline-offset-2 hover:underline"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2
                className="text-2xl font-bold tracking-tight text-foreground mb-6"
                style={{ letterSpacing: '-0.03em' }}
              >
                Événements
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Supprimez un événement et toutes ses inscriptions. Réservé aux administrateurs.
              </p>
              <div className="glass rounded-2xl overflow-hidden ring-1 ring-border/50">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/40">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Début
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Lieu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {events.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">
                            Aucun événement
                          </td>
                        </tr>
                      ) : (
                        events.map((ev) => (
                          <tr key={ev.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm tabular-nums text-foreground">
                              {ev.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground max-w-[220px] truncate" title={ev.nomEvenement}>
                              {ev.nomEvenement}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                              {format(new Date(ev.dateHeureDebut), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-[180px] truncate">
                              {ev.lieu?.ville ?? '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(ev)}
                                className="text-destructive hover:text-destructive/80 underline-offset-2 hover:underline"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
