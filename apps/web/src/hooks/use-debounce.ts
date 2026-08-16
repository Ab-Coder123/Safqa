'use client';

import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Debounces a fast-changing value (e.g. search input text) by a specified delay in milliseconds.
 * Prevents excessive API queries and component re-render cascades.
 * 
 * @param value The value to debounce
 * @param delayMs The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
