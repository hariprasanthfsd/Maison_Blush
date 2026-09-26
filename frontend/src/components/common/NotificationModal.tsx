import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, ShieldAlert } from 'lucide-react';

export interface NotificationState {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  onClose?: () => void;
}

interface NotificationModalProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  if (!notification || !notification.isOpen) return null;

  const { title, message, type = 'error' } = notification;

  const getHeaderStyle = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
          defaultTitle: 'Success Notification',
        };
      case 'warning':
        return {
          icon: <ShieldAlert className="w-8 h-8 text-amber-600" />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          button: 'bg-amber-700 hover:bg-amber-800 text-white',
          defaultTitle: 'Notice',
        };
      case 'info':
        return {
          icon: <Info className="w-8 h-8 text-stone-700" />,
          bg: 'bg-stone-50',
          border: 'border-stone-200',
          button: 'bg-[#2D2325] hover:bg-[#8C5353] text-white',
          defaultTitle: 'Information',
        };
      case 'error':
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-[#8C5353]" />,
          bg: 'bg-[#FAF5F3]',
          border: 'border-[#E8C4C0]',
          button: 'bg-[#8C5353] hover:bg-[#6E3C3D] text-white',
          defaultTitle: 'Payment & Store Notice',
        };
    }
  };

  const style = getHeaderStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Boutique Popup Modal Container */}
      <div className="relative w-full max-w-md bg-[#FFFDFB] rounded-3xl shadow-2xl border border-[#F4E3DF] p-6 sm:p-8 z-50 text-center space-y-5 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-[#2D2325] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center mx-auto shadow-sm`}>
          {style.icon}
        </div>

        {/* Header & Body */}
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-[#2D2325]">
            {title || style.defaultTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#4A3E3F] leading-relaxed font-light">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all ${style.button}`}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
