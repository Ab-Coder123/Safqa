'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
