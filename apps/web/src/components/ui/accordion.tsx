'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/cn';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  type = 'single',
  defaultValue = [],
  className,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value]);
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter((i) => i !== value)
          : [...openItems, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-[var(--border)] border-y border-[var(--border)]', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className }) => {
  return <div className={cn('py-2', className)}>{children}</div>;
};

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used inside Accordion');

  const isOpen = context.openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-3 font-medium text-sm transition-all hover:text-[var(--primary)] text-right cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span className={cn('transition-transform duration-200 text-xs opacity-60', isOpen && 'rotate-180')}>
        ▼
      </span>
    </button>
  );
};

export interface AccordionContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ value, children, className }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used inside Accordion');

  if (!context.openItems.includes(value)) return null;

  return (
    <div className={cn('pb-4 pt-1 text-sm text-[var(--muted-foreground)] animate-fade-in', className)}>
      {children}
    </div>
  );
};
