import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route inexistante:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass rounded-[24px] p-10 text-center max-w-md">
        <h1 className="mb-2 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-sm text-muted-foreground">Page introuvable</p>
        <Link to="/events" className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
          Retour aux événements
        </Link>
      </div>
    </div>
  );
}

