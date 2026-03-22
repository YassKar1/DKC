import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import apiService from '../services/api';
import type { InscriptionReservation } from '../types/inscription.types';
import EventglowNavbar from '../eventglow/components/EventglowNavbar';

export default function Reservations() {
  const navigate = useNavigate();
  const [list, setList] = useState<InscriptionReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getMyReservations();
      setList(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUnsubscribe = async (evenementId: number) => {
    if (!confirm('Se désinscrire de cet événement ?')) return;
    setActionId(evenementId);
    try {
      await apiService.deleteMyInscription(evenementId);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <EventglowNavbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 max-w-2xl">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
          Mes réservations
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Événements auxquels vous êtes inscrit</p>

        <Link
          to="/profile"
          className="text-sm text-primary hover:underline mb-6 inline-block"
        >
          Voir mon profil
        </Link>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted border-t-primary" />
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
        ) : list.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
            Aucune réservation pour le moment.
            <div className="mt-4">
              <Link to="/events" className="text-primary font-medium hover:underline">
                Découvrir les événements
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {list.map((ins) => (
              <li key={ins.id} className="glass rounded-2xl p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {ins.evenementNom || `Événement #${ins.evenementId}`}
                    </h2>
                    {ins.dateInscription ? (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0 text-primary" />
                        Inscrit le{' '}
                        {format(new Date(ins.dateInscription), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => navigate(`/events/${ins.evenementId}`)}
                      className="mt-3 text-sm text-primary hover:underline"
                    >
                      Voir l&apos;événement
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={actionId === ins.evenementId}
                    onClick={() => handleUnsubscribe(ins.evenementId)}
                    className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground ring-1 ring-border hover:bg-secondary/80 disabled:opacity-50"
                  >
                    {actionId === ins.evenementId ? '…' : 'Se désinscrire'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
