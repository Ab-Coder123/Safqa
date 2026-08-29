export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  reports: () => [...adminKeys.all, 'reports'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
};
