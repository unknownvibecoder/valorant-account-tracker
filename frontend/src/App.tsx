import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SearchForm } from './components/SearchForm';
import { PlayerProfileCard } from './components/PlayerProfileCard';
import { MatchHistory } from './components/MatchHistory';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { fetchPlayerProfile, fetchPlayerMatches } from './services/playerService';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [searchTarget, setSearchTarget] = useState<{ name: string; tag: string } | null>(null);

  const profileQuery = useQuery({
    queryKey: ['playerProfile', searchTarget],
    queryFn: () => fetchPlayerProfile(searchTarget!.name, searchTarget!.tag),
    enabled: !!searchTarget,
  });

  const matchesQuery = useQuery({
    queryKey: ['playerMatches', searchTarget],
    queryFn: () => fetchPlayerMatches(searchTarget!.name, searchTarget!.tag),
    enabled: !!searchTarget,
  });

  const handleSearch = (name: string, tag: string) => {
    setSearchTarget({ name, tag });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Bar with Language Switcher */}
      <div className="max-w-4xl mx-auto w-full flex justify-end">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full text-center py-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-r from-red-500 via-rose-400 to-amber-500 bg-clip-text text-transparent uppercase">
          {t('header.title')}
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          {t('header.subtitle')}
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full space-y-8 my-auto flex flex-col items-center">
        <SearchForm onSearch={handleSearch} isLoading={profileQuery.isLoading || matchesQuery.isLoading} />

        {(profileQuery.isError || matchesQuery.isError) && (
          <div className="max-w-2xl w-full bg-red-950/40 border border-red-800/60 text-red-300 px-4 py-3 rounded-xl text-center text-sm shadow-lg">
            {(profileQuery.error as Error)?.message || (matchesQuery.error as Error)?.message || t('errors.not_found')}
          </div>
        )}

        {profileQuery.data && <PlayerProfileCard profile={profileQuery.data} />}
        {matchesQuery.data && <MatchHistory data={matchesQuery.data} />}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6">
        Valorant Account Tracker &copy; {new Date().getFullYear()} — Powered by HenrikDev API
      </footer>
    </div>
  );
};

export default App;