import { useEffect, useState, createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), duration);
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') {
        setToasts([]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border p-4 shadow-2xl transition transform backdrop-blur-xl text-sm font-medium w-80 ${
              toast.type === 'success'
                ? 'bg-emerald-500/95 text-white border-emerald-300'
                : toast.type === 'danger'
                ? 'bg-red-500/95 text-white border-red-300'
                : 'bg-slate-900/95 text-white border-slate-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
