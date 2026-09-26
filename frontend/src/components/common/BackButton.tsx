import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  to?: string;
  fallbackUrl?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  to,
  fallbackUrl = '/',
  className = '',
}) => {
  const navigate = useNavigate();
  const isHomeTarget = label.toLowerCase().includes('home') || to === '/' || fallbackUrl === '/';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If explicit target 'to' is provided, or if user requested to go Home:
    // ALWAYS navigate directly to that path and reset scroll position to top
    if (to) {
      navigate(to);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    if (label.toLowerCase().includes('home')) {
      navigate('/');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    // Otherwise, check if history exists to go back, else fallback
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#4A3E3F] hover:text-[#8C5353] bg-white/80 hover:bg-white border border-[#F4E3DF] hover:border-[#E8C4C0] shadow-sm hover:shadow-soft transition-all duration-200 cursor-pointer ${className}`}
      aria-label={label}
    >
      {isHomeTarget ? (
        <Home className="w-3.5 h-3.5 text-[#C49A8B] group-hover:text-[#8C5353] transition-colors" />
      ) : (
        <ArrowLeft className="w-3.5 h-3.5 text-[#C49A8B] group-hover:text-[#8C5353] transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      <span>{label}</span>
    </button>
  );
};
