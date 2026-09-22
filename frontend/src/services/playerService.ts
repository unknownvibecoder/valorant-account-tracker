import { apiClient } from './api';
import { PlayerProfile, MatchHistoryData } from '../types/player';

export const fetchPlayerProfile = async (name: string, tag: string): Promise<PlayerProfile> => {
  const cleanTag = tag.replace('#', '');
  const response = await apiClient.get<{ success: boolean; data: PlayerProfile }>(
    `/player/${encodeURIComponent(name)}/${encodeURIComponent(cleanTag)}`
  );
  return response.data.data;
};

export const fetchPlayerMatches = async (name: string, tag: string): Promise<MatchHistoryData> => {
  const cleanTag = tag.replace('#', '');
  const response = await apiClient.get<{ success: boolean; data: MatchHistoryData }>(
    `/player/${encodeURIComponent(name)}/${encodeURIComponent(cleanTag)}/matches`
  );
  return response.data.data;
};