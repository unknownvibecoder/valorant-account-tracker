import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, LogOut, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AuthModal } from './components/AuthModal';
import { SearchForm } from './components/SearchForm';
import { PlayerProfileCard } from './components/PlayerProfileCard';
import { MatchHistory } from './components/MatchHistory';
import { fetchPlayerProfile, fetchPlayerMatches } from './services/playerService';
import { PlayerProfile } from './types/player';

// Kiểu dữ liệu User
interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [lastSearch, setLastSearch] = useState<{ name: string; tag: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // State Quản lý User Đăng nhập (Khởi tạo từ localStorage nếu đã đăng nhập trước đó)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // 1. Hàm tìm kiếm người chơi mới
  const handleSearch = async (name: string, tag: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await fetchPlayerProfile(name, tag);

      try {
        const matchData = await fetchPlayerMatches(name, tag);
        if (matchData && matchData.matches) {
          profileData.matches = matchData.matches;
        }
      } catch (matchErr) {
        console.warn('Không thể tải lịch sử trận đấu:', matchErr);
      }

      setProfile(profileData);
      setLastSearch({ name, tag });
    } catch (err: unknown) {
      console.error(err);
      setError(t('errors.api_error'));
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Hàm Live Update / Force Refresh dữ liệu hiện tại
  const handleRefresh = async () => {
    if (!lastSearch || isRefreshing) return;

    setIsRefreshing(true);
    try {
      const profileData = await fetchPlayerProfile(lastSearch.name, lastSearch.tag);

      try {
        const matchData = await fetchPlayerMatches(lastSearch.name, lastSearch.tag);
        if (matchData && matchData.matches) {
          profileData.matches = matchData.matches;
        }
      } catch (matchErr) {
        console.warn('Không thể tải lại lịch sử trận đấu:', matchErr);
      }

      setProfile(profileData);
    } catch (err) {
      console.error('Lỗi khi live update:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 3. Hàm xử lý Đăng nhập/Đăng ký thành công từ AuthModal
  const handleAuthSuccess = (userData: AuthUser) => {
    if (userData) {
      setUser(userData);
    }
  };

  // 4. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Navigation Bar */}
      <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg">
              V
            </div>
            <span className="font-bold text-lg tracking-wider text-white hidden sm:inline">
              {t('header.title')}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            {/* KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP */}
            {user ? (
              /* Nút hiển thị Tên người dùng + Dropdown Menu Đăng xuất */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer outline-none"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="max-w-[120px] truncate">{user.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu khi click vào tên user */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-slate-400 text-[10px]">Đã đăng nhập</p>
                      <p className="text-slate-200 font-medium truncate">{user.email || user.username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Nút Đăng Nhập đỏ khi chưa đăng nhập */
              <button
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsAuthOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-md shadow-red-950/40 outline-none focus:outline-none focus:ring-0 cursor-pointer"
              >
                {t('auth.sign_in')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            {t('header.title')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Search Input & Recent Searches */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Notification */}
        {error && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {/* Profile & Match History Results */}
        {profile && (
          <div className="space-y-8">
            {/* Thanh Status & Nút Live Update */}
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Profile loaded for{' '}
                {lastSearch && (
                  <strong className="text-slate-200">
                    {lastSearch.name}#{lastSearch.tag}
                  </strong>
                )}
              </span>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border border-slate-700/60 disabled:opacity-50 cursor-pointer"
              >
                <span>{isRefreshing ? 'Updating...' : 'Live Update'}</span>
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
              </button>
            </div>

            {/* Profile Card & Matches */}
            <PlayerProfileCard profile={profile} />
            {profile.matches && profile.matches.length > 0 && (
              <MatchHistory matches={profile.matches} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        Valorant Account Tracker © 2026 — Powered by HenrikDev API
      </footer>

      {/* Floating Bottom Toast Banner trong lúc Live Updating */}
      {isRefreshing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 z-50 text-xs text-slate-200">
          <RefreshCw className="w-4 h-4 text-red-500 animate-spin" />
          <span>Live updating your most recent matches...</span>
        </div>
      )}

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;