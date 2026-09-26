import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { NotificationModal, NotificationState } from '../components/common/NotificationModal';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  showModalNotice: (message: string, title?: string, type?: 'error' | 'success' | 'info' | 'warning') => void;
  closeModalNotice: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalState, setModalState] = useState<NotificationState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showModalNotice = (
    message: string,
    title?: string,
    type: 'error' | 'success' | 'info' | 'warning' = 'error'
  ) => {
    setModalState({
      isOpen: true,
      title: title || (type === 'error' ? 'Payment & Store Notice' : 'Notice'),
      message,
      type,
    });
  };

  const closeModalNotice = () => {
    setModalState(null);
  };

  // Override native window.alert so no raw browser alert popups ever appear
  useEffect(() => {
    window.alert = (msg: string) => {
      showModalNotice(msg, 'Store Notice', 'error');
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showModalNotice, closeModalNotice }}>
      {children}
      
      {/* Floating Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-boutique border backdrop-blur-md transition-all duration-300 animate-fade-in ${
              toast.type === 'success'
                ? 'bg-[#FAF5F3]/95 border-[#D9A09A] text-[#2D2325]'
                : toast.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-800'
                : 'bg-stone-50/95 border-stone-300 text-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#8C5353] flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              <span className="text-xs font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Popup Menu / Dialog Modal for Errors and Important Notices */}
      <NotificationModal notification={modalState} onClose={closeModalNotice} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
