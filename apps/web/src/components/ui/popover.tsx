'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/cn';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = 'start',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 p-4 w-72 rounded-xl border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-xl animate-fade-in',
            align === 'start' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
