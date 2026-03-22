import { useEffect, useState } from 'react';

const EVENTGLOW_URL = 'http://localhost:5175';

export default function EventglowTemplate() {
  const [isUp, setIsUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(EVENTGLOW_URL, { method: 'GET' })
      .then(() => {
        if (!cancelled) setIsUp(true);
      })
      .catch(() => {
        if (!cancelled) setIsUp(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold">Template Eventglow</h1>
            <p className="text-sm text-gray-600">
              Affiché depuis <code>{EVENTGLOW_URL}</code> dans une iframe.
            </p>
          </div>
          <div className="text-sm">
            {isUp === null ? (
              <span className="text-gray-600">Vérification…</span>
            ) : isUp ? (
              <span className="text-green-700">Serveur template OK</span>
            ) : (
              <span className="text-red-700">
                Serveur template hors ligne (lance-le sur le port 5175)
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <iframe
            src={EVENTGLOW_URL}
            title="Eventglow template"
            className="w-full"
            style={{ height: 'calc(100vh - 160px)' }}
          />
        </div>
      </div>
    </div>
  );
}

