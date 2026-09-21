import React from 'react';
import { PlayerProfile } from '../types/player';

interface Props {
  profile: PlayerProfile;
}

export const PlayerProfileCard: React.FC<Props> = ({ profile }) => {
  const { account, mmr } = profile;

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Banner / Wide Card */}
      <div className="relative h-32 sm:h-40 bg-slate-800 overflow-hidden">
        {account.card.wide && (
          <img
            src={account.card.wide}
            alt={account.name}
            className="w-full h-full object-cover object-center opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Profile Details */}
      <div className="px-6 pb-6 relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-red-500/80 shadow-xl bg-slate-950 flex-shrink-0">
          <img src={account.card.small} alt={account.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 right-0 bg-slate-950/90 text-xs px-2 py-0.5 rounded-tl border-t border-l border-slate-700 text-slate-300">
            Lvl {account.account_level}
          </div>
        </div>

        {/* Name & Region */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {account.name} <span className="text-slate-400 font-normal">#{account.tag}</span>
          </h2>
          <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">Khu vực: {account.region}</p>
        </div>

        {/* Rank Badge */}
        {mmr && (
          <div className="flex flex-col items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <img src={mmr.images.large || mmr.images.small} alt={mmr.currenttierpatched} className="w-16 h-16 object-contain" />
            <span className="text-xs font-semibold text-slate-200 mt-1">{mmr.currenttierpatched}</span>
            <span className="text-[11px] text-red-400 font-mono mt-0.5">{mmr.ranking_in_tier} RR</span>
          </div>
        )}
      </div>
    </div>
  );
};