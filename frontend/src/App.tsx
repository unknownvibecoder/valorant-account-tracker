import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Shield, Activity } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-rose-500" />
              <span className="font-bold text-xl tracking-wider text-slate-100">
                VALORANT<span className="text-rose-500">TRACKER</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5" />
              <span>Phase 1 Scaffolding Ready</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Production Foundation <span className="text-rose-500">Initialized</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg mb-8">
            The multi-tier backend proxy architecture and dark-mode gaming layout are established and configured for future developer or AI agent extensions.
          </p>
        </main>

        <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          © 2026 VALORANT Tracker Project. Strictly compliant with Riot Games API policies.
        </footer>
      </div>
    </QueryClientProvider>
  );
}