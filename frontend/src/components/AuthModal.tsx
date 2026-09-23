import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lắng nghe phím ESC & Tắt cuộn trang background khi Modal mở
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Đăng ký:', { identifier, email, password });
    } else {
      console.log('Đăng nhập:', { identifier, password });
    }
  };

  // Hàm điều hướng liên kết Đăng nhập Mạng xã hội (OAuth 2.0)
  const handleSocialLogin = (provider: 'google' | 'discord' | 'facebook') => {
    // Sử dụng import.meta.env chuẩn dành cho Vite
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Chuyển hướng trình duyệt đến Endpoint xử lý OAuth trên Backend
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
  };

  return (
    /* Khung Overlay với hiệu ứng Fade-in/Fade-out */
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-200 ease-out ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Khung Nội dung Modal */}
      <div
        className={`w-full max-w-[360px] flex flex-col items-center space-y-4 relative transition-all duration-200 ease-out transform ${
          isOpen
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-3 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng Modal */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-slate-400 hover:text-white text-xl p-1 transition-colors outline-none focus:outline-none"
          title="Đóng (ESC)"
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="p-2 rounded-full bg-slate-900 border border-slate-800 shadow-xl">
          <svg className="w-10 h-10 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
          </svg>
        </div>

        {/* TIÊU ĐỀ */}
        <h2 className="text-xl font-semibold text-slate-100 text-center tracking-tight">
          {isSignUp ? t('auth.sign_up_title') : t('auth.sign_in_title')}
        </h2>

        {/* KHUNG FORM CHÍNH */}
        <div className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isSignUp ? t('auth.username') : t('auth.email_or_username')}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-1.5 text-sm text-slate-100 outline-none transition-all"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {t('auth.password')}
                </label>
                {!isSignUp && (
                  <a href="#forgot" className="text-xs text-blue-400 hover:underline">
                    {t('auth.forgot_password')}
                  </a>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-1.5 text-sm text-slate-100 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#238636] hover:bg-[#2ea043] active:scale-[0.98] text-white font-medium text-sm py-2 rounded-md transition-all shadow-sm mt-2 outline-none focus:outline-none"
            >
              {isSignUp ? t('auth.sign_up') : t('auth.sign_in')}
            </button>
          </form>

          {/* ĐƯỜNG PHÂN CÁCH */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-[#30363d] w-full" />
            <span className="bg-[#161b22] px-2 text-xs text-slate-400 font-medium absolute">
              {t('auth.or')}
            </span>
          </div>

          {/* CÁC NÚT MẠNG XÃ HỘI */}
          <div className="space-y-2">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-[#21262d] hover:bg-[#30363d] active:scale-[0.98] border border-[#30363d] text-slate-200 font-medium text-xs py-2 px-3 rounded-md flex items-center justify-center gap-2.5 transition-all outline-none focus:outline-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {t('auth.continue_google')}
            </button>

            {/* Discord */}
            <button
              type="button"
              onClick={() => handleSocialLogin('discord')}
              className="w-full bg-[#21262d] hover:bg-[#30363d] active:scale-[0.98] border border-[#30363d] text-slate-200 font-medium text-xs py-2 px-3 rounded-md flex items-center justify-center gap-2.5 transition-all outline-none focus:outline-none"
            >
              <svg className="w-4 h-4 text-[#5865F2] fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              {t('auth.continue_discord')}
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full bg-[#21262d] hover:bg-[#30363d] active:scale-[0.98] border border-[#30363d] text-slate-200 font-medium text-xs py-2 px-3 rounded-md flex items-center justify-center gap-2.5 transition-all outline-none focus:outline-none"
            >
              <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t('auth.continue_facebook')}
            </button>
          </div>
        </div>

        {/* FOOTER SWITCH FORM */}
        <div className="w-full border border-[#30363d] rounded-xl bg-[#161b22] p-4 text-center text-xs text-slate-300">
          {isSignUp ? (
            <p>
              {t('auth.already_have_account')}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-400 hover:underline font-medium ml-1 outline-none"
              >
                {t('auth.sign_in_now')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.new_to_app')}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-400 hover:underline font-medium ml-1 outline-none"
              >
                {t('auth.create_account')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};