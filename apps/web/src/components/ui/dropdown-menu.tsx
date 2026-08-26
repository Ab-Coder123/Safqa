'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/cn';

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'center' | "start" | "end";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'center',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-right" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-6 w-56 rounded-xl border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg animate-fade-in py-1 overflow-hidden',
            align === 'center' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
> = ({ className, children, disabled, onClick, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors text-right disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </button>
);
