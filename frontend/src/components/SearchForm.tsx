import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (name: string, tag: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [riotId, setRiotId] = useState('');
  const [tagline, setTagline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (riotId.trim() && tagline.trim()) {
      onSearch(riotId.trim(), tagline.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-0 sm:flex sm:gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Riot ID (VD: Tenz)"
          value={riotId}
          onChange={(e) => setRiotId(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        />
      </div>
      <div className="w-full sm:w-36 relative">
        <span className="absolute left-3 top-3.5 text-slate-400">#</span>
        <input
          type="text"
          placeholder="TAG"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          required
          className="w-full pl-8 pr-4 py-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Tra cứu'
        )}
      </button>
    </form>
  );
};