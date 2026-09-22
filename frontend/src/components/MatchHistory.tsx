import React from 'react';
import { useTranslation } from 'react-i18next';
import { MatchHistoryData } from '../types/player';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  data: MatchHistoryData;
}

export const MatchHistory: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const { matches, stats } = data;

  // Đảo ngược mảng trận đấu để vẽ biểu đồ theo thứ tự thời gian từ cũ tới mới
  const chartData = [...matches].reverse().map((m) => ({
    date: m.map,
    KD: m.kd_ratio,
    HS: m.headshot_percent,
  }));

  return (
    <div className="w-full max-w-4xl mt-8 space-y-6">
      {/* 1. Thống kê chỉ số tổng quan 5 trận */}
      <div className="grid grid-cols-3 gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
        <div>
          <p className="text-slate-400 text-sm font-medium">{t('stats.win_rate')}</p>
          <p className={`text-2xl font-extrabold ${stats.win_rate >= 50 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {stats.win_rate}%
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">{t('stats.avg_kd')}</p>
          <p className="text-2xl font-extrabold text-amber-400">{stats.avg_kd}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">{t('stats.headshot_pct')}</p>
          <p className="text-2xl font-extrabold text-cyan-400">{stats.headshot_pct}%</p>
        </div>
      </div>

      {/* 2. Biểu đồ K/D Trend */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">{t('stats.kd_trend')}</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 'dataMax + 0.5']} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Line type="monotone" dataKey="KD" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Danh sách trận đấu */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">{t('stats.recent_matches')}</h3>
        {matches.map((match) => {
          const isWin = match.result === 'Victory';
          return (
            <div
              key={match.match_id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isWin
                  ? 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-rose-950/30 border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-center space-x-4">
                {match.agent_icon && (
                  <img src={match.agent_icon} alt={match.agent} className="w-12 h-12 rounded-lg bg-slate-800 p-1" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    {/* Đưa Tên Agent lên làm Tiêu đề In đậm */}
                    <span className="font-bold text-white">{match.agent}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{match.mode}</span>
                  </div>
                  {/* Chuyển Tên Map + Ngày xuống dòng phụ */}
                  <p className="text-sm text-slate-400">{match.map} • {match.date}</p>
                </div>
              </div>

              <div className="text-center">
                <span className={`text-lg font-black ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {match.score}
                </span>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  {match.result === 'Victory' ? t('stats.victory') : match.result === 'Defeat' ? t('stats.defeat') : t('stats.draw')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-slate-200">
                  {match.kills} / {match.deaths} / {match.assists}
                </p>
                <p className="text-xs text-amber-400 font-semibold">K/D: {match.kd_ratio} • HS: {match.headshot_percent}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};