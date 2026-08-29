export const userKeys = {
  all: ['users'] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};
