export interface ValorantAccount {
  puuid: string;
  name: string;
  tag: string;
  account_level: number;
  card: {
    small: string;
    large: string;
    wide: string;
  };
  region: string;
}

export interface ValorantMMR {
  currenttierpatched: string;
  ranking_in_tier: number;
  images: {
    small: string;
    large: string;
    triangle_up: string;
    triangle_down: string;
  };
}

export interface PlayerProfileResponse {
  account: ValorantAccount;
  mmr?: ValorantMMR;
}
export interface PlayerMatchStats {
  match_id: string;
  map: string;
  mode: string;
  agent: string;
  agent_icon: string;
  kills: number;
  deaths: number;
  assists: number;
  kd_ratio: number;
  headshot_percent: number;
  result: 'Victory' | 'Defeat' | 'Draw';
  score: string; // ví dụ "13 - 9"
  date: string;
}

export interface MatchHistoryResponse {
  matches: PlayerMatchStats[];
  stats: {
    win_rate: number;
    avg_kd: number;
    headshot_pct: number;
  };
}