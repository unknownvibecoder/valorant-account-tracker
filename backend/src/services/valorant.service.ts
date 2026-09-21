import 'dotenv/config';
import axios from 'axios';
import { ValorantAccount, ValorantMMR, PlayerProfileResponse } from '../types/valorant.js';

const HENRIK_API_BASE = 'https://api.henrikdev.xyz/valorant';

export class ValorantService {
  static async getPlayerProfile(name: string, tag: string): Promise<PlayerProfileResponse> {
    const apiKey = process.env.HENRIK_API_KEY?.trim() || '';

    console.log('--------------------------------------------------');
    console.log(`🔍 [Backend] Dang tra cuu: ${name}#${tag}`);
    console.log(`🔑 [Backend] Key dang dung: "${apiKey ? apiKey.substring(0, 10) + '...' : 'KHONG CO KEY'}"`);
    console.log('--------------------------------------------------');

    if (!apiKey) {
      throw new Error('Chua tim thay HENRIK_API_KEY trong file backend/.env');
    }

    try {
      // 1. Lay thong tin tai khoan
      const accountRes = await axios.get(
        `${HENRIK_API_BASE}/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        {
          headers: {
            'Authorization': apiKey,
            'User-Agent': 'ValorantAccountTracker/1.0.0',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (!accountRes.data || accountRes.data.status !== 200) {
        throw new Error(accountRes.data?.message || 'Khong tim thay nguoi choi nay');
      }

      const account: ValorantAccount = accountRes.data.data;

      // 2. Lay thong tin Rank / MMR
      let mmr: ValorantMMR | undefined;
      try {
        const mmrRes = await axios.get(
          `${HENRIK_API_BASE}/v2/by-puuid/mmr/${account.region}/${account.puuid}`,
          {
            headers: {
              'Authorization': apiKey,
              'User-Agent': 'ValorantAccountTracker/1.0.0',
              'Accept': 'application/json',
            },
            timeout: 10000,
          }
        );
        if (mmrRes.data?.status === 200 && mmrRes.data?.data?.current_data) {
          mmr = mmrRes.data.data.current_data;
        }
      } catch (err) {
        console.warn('⚠️ Khong the lay du lieu Rank/MMR, giu nguyen thong tin Account');
      }

      return { account, mmr };
    } catch (error: any) {
      if (error.response) {
        console.error('❌ [HenrikDev API Error]:', error.response.status, error.response.data);
      }

      if (error.response?.status === 401) {
        throw new Error('API Key HenrikDev khong hop le hoac bi tu choi (401)');
      }
      if (error.response?.status === 404) {
        throw new Error(`Khong tim thay Riot ID "${name}#${tag}". Vui long kiem tra lai Tagline`);
      }
      if (error.response?.status === 429) {
        throw new Error('API dang bi gioihan luot goi (Rate Limit), thu lai sau 1 phut');
      }
      throw new Error(error.response?.data?.message || error.message || 'Loi ket noi toi he thong Valorant');
    }
  }
}