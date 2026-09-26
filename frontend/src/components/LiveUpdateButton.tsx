import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react'; // npm install lucide-react

interface RefreshButtonProps {
  name: string;
  tag: string;
  onRefreshComplete: (newData: any) => void;
}

export const LiveUpdateButton: React.FC<RefreshButtonProps> = ({ name, tag, onRefreshComplete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setMessage('Updating latest stats...');

    try {
      // Gọi API Backend kèm query param ?force=true để bỏ qua Cache
      const res = await fetch(`http://localhost:5000/api/player/${name}/${tag}?force=true`);
      const data = await res.json();

      if (res.ok) {
        setMessage('Updated successfully!');
        onRefreshComplete(data); // Cập nhật lại stats mới vào state cha
      } else if (res.status === 403 || data.isPrivate) {
        setMessage('Profile is still private!');
      } else {
        setMessage('Failed to update.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    } finally {
      setIsUpdating(false);
      // Tự động ẩn message sau 3 giây
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRefresh}
        disabled={isUpdating}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 disabled:opacity-50"
      >
        <span>{isUpdating ? 'Updating...' : 'Refresh Stats'}</span>
        <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin text-red-500' : ''}`} />
      </button>

      {/* Banner/Toast nhỏ hiển thị trạng thái phía dưới */}
      {message && (
        <span className="text-xs text-gray-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
          {message}
        </span>
      )}
    </div>
  );
};