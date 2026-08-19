'use client';

import dynamic from 'next/dynamic';

const LoginForm = dynamic(
  () => import('./login-form').then((mod) => mod.LoginForm),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[var(--background)]" aria-busy="true" />
    ),
  },
);

export function LoginShell() {
  return <LoginForm />;
}
