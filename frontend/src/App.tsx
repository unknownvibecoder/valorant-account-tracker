import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AuthModal } from './components/AuthModal';
import { SearchForm } from './components/SearchForm';
import { PlayerProfileCard } from './components/PlayerProfileCard';
import { MatchHistory } from './components/MatchHistory';
import { fetchPlayerProfile, fetchPlayerMatches } from './services/playerService';
import { PlayerProfile } from './types/player';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const handleSearch = async (name: string, tag: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Tải thông tin hồ sơ người chơi
      const profileData = await fetchPlayerProfile(name, tag);

      // 2. Tải lịch sử trận đấu và gắn vào hồ sơ
      try {
        const matchData = await fetchPlayerMatches(name, tag);
        if (matchData && matchData.matches) {
          profileData.matches = matchData.matches;
        }
      } catch (matchErr) {
        console.warn('Không thể tải lịch sử trận đấu:', matchErr);
      }

      setProfile(profileData);
    } catch (err: unknown) {
      console.error(err);
      setError(t('errors.api_error'));
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Navigation Bar */}
      <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg">
              V
            </div>
            <span className="font-bold text-lg tracking-wider text-white hidden sm:inline">
              {t('header.title')}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            {/* Nút Sign In đã được sửa lỗi viền outline / focus */}
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                setIsAuthOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-md shadow-red-950/40 outline-none focus:outline-none focus:ring-0"
            >
              {t('auth.sign_in')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            {t('header.title')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Search Input & Recent Searches */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Notification */}
        {error && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {/* Profile & Match History Results */}
        {profile && (
          <div className="space-y-8">
            <PlayerProfileCard profile={profile} />
            {profile.matches && profile.matches.length > 0 && (
              <MatchHistory matches={profile.matches} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        Valorant Account Tracker © 2026 — Powered by HenrikDev API
      </footer>

      {/* Login & Signup Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default App;