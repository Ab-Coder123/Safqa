'use client';

import dynamic from 'next/dynamic';

const RegisterForm = dynamic(
  () => import('./register-form').then((mod) => mod.RegisterForm),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[var(--background)]" aria-busy="true" />
    ),
  },
);

export function RegisterShell() {
  return <RegisterForm />;
}
