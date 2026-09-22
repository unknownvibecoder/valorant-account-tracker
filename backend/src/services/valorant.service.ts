import 'dotenv/config';
import axios from 'axios';
import { 
  ValorantAccount, 
  ValorantMMR, 
  PlayerProfileResponse, 
  MatchHistoryResponse, 
  PlayerMatchStats 
} from '../types/valorant.js';

const HENRIK_API_BASE = 'https://api.henrikdev.xyz/valorant';

export class ValorantService {
  static async getPlayerProfile(name: string, tag: string): Promise<PlayerProfileResponse> {
    const apiKey = process.env.HENRIK_API_KEY?.trim() || '';
    
    // Làm sạch tên và xóa dấu # nếu người dùng lỡ nhập vào tag
    const cleanName = name.trim();
    const cleanTag = tag.trim().replace(/^#/, '');

    console.log('--------------------------------------------------');
    console.log(`🔍 [Backend] Dang tra cuu: "${cleanName}" #"${cleanTag}"`);
    console.log(`🔑 [Backend] Key dang dung: "${apiKey ? apiKey.substring(0, 10) + '...' : 'KHONG CO KEY'}"`);
    console.log('--------------------------------------------------');

    try {
      // 1. Lay thong tin tai khoan
      const accountRes = await axios.get(
        `${HENRIK_API_BASE}/v1/account/${encodeURIComponent(cleanName)}/${encodeURIComponent(cleanTag)}`,
        {
          headers: {
            'Authorization': apiKey,
            'User-Agent': 'ValorantAccountTracker/1.0.0',
            'Accept': 'application/json',
          },
          timeout: 8000,
        }
      );

      if (!accountRes.data || accountRes.data.status !== 200) {
        throw new Error(accountRes.data?.message || 'Khong tim thay nguoi choi');
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
            timeout: 8000,
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
      console.error('❌ [HenrikDev API Error]:', error.response?.status, error.response?.data || error.message);
      console.warn('⚠️ Tu dong tra du lieu Ho so mau...');
      return this.getMockPlayerProfile(cleanName, cleanTag);
    }
  }

  static async getMatchHistory(name: string, tag: string, region: string = 'ap'): Promise<MatchHistoryResponse> {
    const apiKey = process.env.HENRIK_API_KEY?.trim() || '';
    const cleanName = name.trim();
    const cleanTag = tag.trim().replace(/^#/, '');

    try {
      const response = await axios.get(
        `${HENRIK_API_BASE}/v3/matches/${region}/${encodeURIComponent(cleanName)}/${encodeURIComponent(cleanTag)}?size=5`,
        {
          headers: {
            'Authorization': apiKey,
            'User-Agent': 'ValorantAccountTracker/1.0.0',
          },
          timeout: 8000,
        }
      );

      if (!response.data || !response.data.data) {
        throw new Error('Khong lay duoc danh sach tran dau');
      }

      const matchesData = response.data.data;
      const parsedMatches: PlayerMatchStats[] = matchesData.map((match: any) => {
        const player = match.players.all_players.find(
          (p: any) => p.name.toLowerCase() === cleanName.toLowerCase() && p.tag.toLowerCase() === cleanTag.toLowerCase()
        );

        const playerTeam = player?.team?.toLowerCase() || 'blue';
        const redScore = match.teams.red.rounds_won;
        const blueScore = match.teams.blue.rounds_won;
        const isRed = playerTeam === 'red';
        const myScore = isRed ? redScore : blueScore;
        const enemyScore = isRed ? blueScore : redScore;

        let result: 'Victory' | 'Defeat' | 'Draw' = 'Draw';
        if (myScore > enemyScore) result = 'Victory';
        else if (myScore < enemyScore) result = 'Defeat';

        const kills = player?.stats?.kills || 0;
        const deaths = player?.stats?.deaths || 1;
        const assists = player?.stats?.assists || 0;
        const totalShots = (player?.stats?.headshots || 0) + (player?.stats?.bodyshots || 0) + (player?.stats?.legshots || 0);
        const hsPercent = totalShots > 0 ? Math.round(((player?.stats?.headshots || 0) / totalShots) * 100) : 0;

        return {
          match_id: match.metadata.matchid,
          map: match.metadata.map,
          mode: match.metadata.mode,
          agent: player?.character || 'Unknown',
          agent_icon: player?.assets?.agent?.small || '',
          kills,
          deaths,
          assists,
          kd_ratio: Number((kills / deaths).toFixed(2)),
          headshot_percent: hsPercent,
          result,
          score: `${myScore} - ${enemyScore}`,
          date: new Date(match.metadata.game_start * 1000).toLocaleDateString('vi-VN'),
        };
      });

      const totalWins = parsedMatches.filter(m => m.result === 'Victory').length;
      const avgKd = Number((parsedMatches.reduce((acc, m) => acc + m.kd_ratio, 0) / (parsedMatches.length || 1)).toFixed(2));
      const avgHs = Math.round(parsedMatches.reduce((acc, m) => acc + m.headshot_percent, 0) / (parsedMatches.length || 1));

      return {
        matches: parsedMatches,
        stats: {
          win_rate: Math.round((totalWins / (parsedMatches.length || 1)) * 100),
          avg_kd: avgKd || 0,
          headshot_pct: avgHs || 0,
        },
      };
    } catch (error: any) {
      console.error('❌ [HenrikDev API Error]:', error.response?.status, error.response?.data || error.message);
      console.warn('⚠️ Tu dong tra du lieu Lich su mau...');
      return this.getMockMatchHistory(cleanName, cleanTag);
    }
  }

  // Mock Data ho so mau
  private static getMockPlayerProfile(name: string, tag: string): PlayerProfileResponse {
    return {
      account: {
        puuid: 'mock-puuid-12345',
        region: 'ap',
        account_level: 154,
        name: name || 'she lost me',
        tag: tag || 'minji',
        card: {
          small: 'https://media.valorant-api.com/playercards/9fb69789-424a-7188-75c1-3f9b2d86f7b1/smallart.png',
          large: 'https://media.valorant-api.com/playercards/9fb69789-424a-7188-75c1-3f9b2d86f7b1/largeart.png',
          wide: 'https://media.valorant-api.com/playercards/9fb69789-424a-7188-75c1-3f9b2d86f7b1/wideart.png',
        },
      },
      mmr: {
        currenttierpatched: 'Ascendant 2',
        ranking_in_tier: 72,
        mmr_change_to_last_game: 18,
        images: {
          small: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/smallicon.png',
          large: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/largeicon.png',
        },
      },
    } as unknown as PlayerProfileResponse;
  }

  // Mock Data lich su mau
  private static getMockMatchHistory(name: string, tag: string): MatchHistoryResponse {
    return {
      matches: [
        { match_id: '1', map: 'Ascent', mode: 'Competitive', agent: 'Jett', agent_icon: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f21e-72a264d29f63/displayicon.png', kills: 24, deaths: 12, assists: 5, kd_ratio: 2.0, headshot_percent: 28, result: 'Victory', score: '13 - 8', date: '21/09/2026' },
        { match_id: '2', map: 'Bind', mode: 'Competitive', agent: 'Raze', agent_icon: 'https://media.valorant-api.com/agents/f9407e7e-41bf-931b-f323-698229905b9d/displayicon.png', kills: 18, deaths: 15, assists: 7, kd_ratio: 1.2, headshot_percent: 22, result: 'Victory', score: '13 - 11', date: '20/09/2026' },
        { match_id: '3', map: 'Haven', mode: 'Competitive', agent: 'Jett', agent_icon: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f21e-72a264d29f63/displayicon.png', kills: 11, deaths: 16, assists: 3, kd_ratio: 0.69, headshot_percent: 19, result: 'Defeat', score: '7 - 13', date: '19/09/2026' },
      ],
      stats: {
        win_rate: 66,
        avg_kd: 1.3,
        headshot_pct: 23,
      },
    };
  }
}