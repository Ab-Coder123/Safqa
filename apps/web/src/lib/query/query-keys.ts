export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  favorites: {
    all: ['favorites'] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    detail: (id: string) => [...queryKeys.conversations.all, id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  reports: {
    all: ['reports'] as const,
  },
  admin: {
    all: ['admin'] as const,
  },
};
