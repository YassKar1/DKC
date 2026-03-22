import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    try {
      await login(username, password);
      navigate('/events');
    } catch (err) {
      console.error('Erreur login:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="glass rounded-[24px] p-8">
          <h1
            className="text-2xl font-bold text-foreground mb-1"
            style={{ letterSpacing: '-0.04em' }}
          >
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Accédez à votre compte EventDKC
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm ring-1 ring-destructive/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-3 glass-thin rounded-xl px-4 py-3">
                <User className="w-4 h-4 text-primary shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur ou email"
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 glass-thin rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary/90">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
