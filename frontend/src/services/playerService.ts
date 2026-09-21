import { apiClient } from './api';
import { PlayerProfile } from '../types/player';

export const fetchPlayerProfile = async (name: string, tag: string): Promise<PlayerProfile> => {
  const cleanTag = tag.replace('#', '');
  const response = await apiClient.get<{ success: boolean; data: PlayerProfile }>(
    `/player/${encodeURIComponent(name)}/${encodeURIComponent(cleanTag)}`
  );
  return response.data.data;
};