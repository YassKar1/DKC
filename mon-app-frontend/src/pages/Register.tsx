import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register({
        nom,
        prenom,
        email,
        telephone,
        username,
        password,
      });
      navigate('/login');
    } catch (err) {
      console.error('Erreur inscription:', err);
    }
  };

  const inputClass = "w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none";
  const wrapClass = "flex items-center gap-3 glass-thin rounded-xl px-4 py-3";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="glass rounded-[24px] p-8">
          <h1
            className="text-2xl font-bold text-foreground mb-1"
            style={{ letterSpacing: '-0.04em' }}
          >
            Inscription
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Créez votre compte EventDKC
          </p>

          {(error || localError) && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm ring-1 ring-destructive/30">
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={wrapClass}>
                <User className="w-4 h-4 text-primary shrink-0" />
                <input
                  id="prenom"
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div className={wrapClass}>
                <User className="w-4 h-4 text-primary shrink-0" />
                <input
                  id="nom"
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={wrapClass}>
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div className={wrapClass}>
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <input
                id="telephone"
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Téléphone"
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div className={wrapClass}>
              <User className="w-4 h-4 text-primary shrink-0" />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div className={wrapClass}>
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (6 caractères min.)"
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div className={wrapClass}>
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Tout nouvel inscrit reçoit le rôle <strong>Utilisateur</strong>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Inscription…' : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
