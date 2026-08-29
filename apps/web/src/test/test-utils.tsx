import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface AllTheProvidersProps {
  children: React.ReactNode;
}

export function createTestWrapper(queryClient: QueryClient = createTestQueryClient()) {
  return function TestWrapper({ children }: AllTheProvidersProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
): RenderResult {
  const { queryClient, ...renderOptions } = options || {};
  const Wrapper = createTestWrapper(queryClient);

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
