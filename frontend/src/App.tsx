import { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { PlayerProfileCard } from './components/PlayerProfileCard';
import { fetchPlayerProfile } from './services/playerService';
import { PlayerProfile } from './types/player';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (name: string, tag: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlayerProfile(name, tag);
      setProfile(data);
    } catch (err: any) {
      setProfile(null);
      setError(err.response?.data?.error || err.message || 'Không tìm thấy người chơi này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full text-center py-8">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-r from-red-500 via-rose-400 to-amber-500 bg-clip-text text-transparent uppercase">
          VALORANT TRACKER
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Tra cứu thứ hạng, chỉ số và hồ sơ người chơi kịch tính
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full space-y-8 my-auto">
        <SearchForm onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="max-w-2xl mx-auto bg-red-950/40 border border-red-800/60 text-red-300 px-4 py-3 rounded-xl text-center text-sm shadow-lg">
            {error}
          </div>
        )}

        {profile && <PlayerProfileCard profile={profile} />}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6">
        Valorant Account Tracker &copy; {new Date().getFullYear()} — Powered by HenrikDev API
      </footer>
    </div>
  );
}