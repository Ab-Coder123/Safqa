'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/cn';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'inline-flex items-center justify-center p-1 rounded-xl bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)]/40',
      className
    )}
    {...props}
  />
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used inside Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer select-none',
        isActive
          ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm font-semibold'
          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used inside Tabs');

  if (context.activeTab !== value) return null;

  return (
    <div className={cn('mt-4 animate-fade-in', className)} {...props}>
      {children}
    </div>
  );
};
