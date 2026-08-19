import { LoginShell } from '@/features/auth/components/login-shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | صفقة',
  description: 'سجل دخولك إلى منصة صفقة للبيع والشراء المباشر.',
};

export default function LoginPage() {
  return <LoginShell />;
}
