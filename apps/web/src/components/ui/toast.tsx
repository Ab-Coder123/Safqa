'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/cn';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  toast: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = ({ title, description, type = 'info' }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto p-4 rounded-xl border shadow-lg text-sm transition-all animate-fade-in flex flex-col gap-1',
              t.type === 'success' && 'bg-[var(--success-background)] border-[var(--success)]/30 text-[var(--success-foreground)]',
              t.type === 'error' && 'bg-[var(--destructive-background)] border-[var(--destructive)]/30 text-[var(--destructive-foreground)]',
              t.type === 'warning' && 'bg-[var(--warning-background)] border-[var(--warning)]/30 text-[var(--warning-foreground)]',
              t.type === 'info' && 'bg-[var(--info-background)] border-[var(--info)]/30 text-[var(--info-foreground)]'
            )}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="text-xs opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
