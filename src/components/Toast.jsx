import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />;
      case 'error':
        return <FiAlertCircle className="text-rose-500 text-lg flex-shrink-0" />;
      case 'warning':
        return <FiAlertCircle className="text-amber-500 text-lg flex-shrink-0" />;
      default:
        return <FiInfo className="text-indigo-500 text-lg flex-shrink-0" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-white border-emerald-100 shadow-emerald-50 text-slate-800';
      case 'error':
        return 'bg-white border-rose-100 shadow-rose-50 text-slate-800';
      case 'warning':
        return 'bg-white border-amber-100 shadow-amber-50 text-slate-800';
      default:
        return 'bg-white border-indigo-100 shadow-indigo-50 text-slate-800';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-slide-in transition-all duration-300 ${getToastStyles(
              toast.type
            )}`}
            style={{
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {getToastIcon(toast.type)}
            <p className="text-sm font-medium flex-grow">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      {/* Embedded Slide In Animation CSS */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(1rem) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
