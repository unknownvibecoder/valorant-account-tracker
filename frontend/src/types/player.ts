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
  };
}

export interface PlayerProfile {
  account: ValorantAccount;
  mmr?: ValorantMMR;
}