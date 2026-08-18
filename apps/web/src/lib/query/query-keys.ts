export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.products.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    myListings: () => [...queryKeys.products.all, 'my-listings'] as const,
  },
  favorites: {
    all: ['favorites'] as const,
    list: () => [...queryKeys.favorites.all, 'list'] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    list: () => [...queryKeys.conversations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.conversations.all, 'detail', id] as const,
    messages: (id: string) => [...queryKeys.conversations.detail(id), 'messages'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: () => [...queryKeys.reports.all, 'list'] as const,
  },
  users: {
    all: ['users'] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    reports: () => [...queryKeys.admin.all, 'reports'] as const,
    users: () => [...queryKeys.admin.all, 'users'] as const,
  },
};
