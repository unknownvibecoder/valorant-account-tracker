import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.substring(0, 2) || 'vi';

  const languages = [
    { code: 'vi', label: 'VN', flag: '🇻🇳' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 p-1 rounded-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
            currentLang === lang.code
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};