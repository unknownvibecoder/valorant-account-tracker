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