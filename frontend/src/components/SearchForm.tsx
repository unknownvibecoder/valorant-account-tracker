import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchFormProps {
  onSearch: (name: string, tag: string) => void;
  isLoading: boolean;
}

interface RecentSearchItem {
  name: string;
  tag: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  // Tải lịch sử tìm kiếm từ localStorage khi component render
  useEffect(() => {
    const saved = localStorage.getItem('valorant_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Không thể đọc lịch sử từ localStorage:', e);
      }
    }
  }, []);

  // Hàm lưu hoặc cập nhật danh sách tìm kiếm
  const saveSearchItem = (searchName: string, searchTag: string) => {
    const cleanName = searchName.trim();
    const cleanTag = searchTag.trim().replace('#', '');
    if (!cleanName || !cleanTag) return;

    const newItem = { name: cleanName, tag: cleanTag };

    // Loại bỏ trùng lặp và giữ tối đa 5 người gần nhất
    const filtered = recentSearches.filter(
      (item) => !(item.name.toLowerCase() === cleanName.toLowerCase() && item.tag.toLowerCase() === cleanTag.toLowerCase())
    );
    const updated = [newItem, ...filtered].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('valorant_recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tag) return;
    saveSearchItem(name, tag);
    onSearch(name.trim(), tag.trim().replace('#', ''));
  };

  // Chọn từ lịch sử tìm kiếm
  const handleSelectRecent = (item: RecentSearchItem) => {
    setName(item.name);
    setTag(item.tag);
    saveSearchItem(item.name, item.tag);
    onSearch(item.name, item.tag);
  };

  // Xóa 1 mục khỏi lịch sử
  const handleRemoveItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem('valorant_recent_searches', JSON.stringify(updated));
  };

  // Xóa tất cả lịch sử
  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem('valorant_recent_searches');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('search.placeholder_name')}
          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          required
        />
        <div className="relative flex-1 sm:max-w-[150px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">#</span>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value.replace('#', ''))}
            placeholder={t('search.placeholder_tag')}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-7 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center justify-center min-w-[110px]"
        >
          {isLoading ? t('search.loading') : t('search.button')}
        </button>
      </form>

      {/* Hiển thị danh sách Lịch sử tìm kiếm */}
      {recentSearches.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1 font-medium">
              🕒 {t('search.recent_searches')}
            </span>
            <button
              onClick={handleClearAll}
              className="hover:text-red-400 transition-colors underline decoration-dashed"
            >
              {t('search.clear_history')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, index) => (
              <div
                key={`${item.name}-${item.tag}-${index}`}
                onClick={() => handleSelectRecent(item)}
                className="group flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-sm"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-slate-500 font-mono">#{item.tag}</span>
                <button
                  onClick={(e) => handleRemoveItem(e, index)}
                  className="ml-1 text-slate-500 hover:text-red-400 rounded px-1 transition-colors"
                  title="Xóa"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};