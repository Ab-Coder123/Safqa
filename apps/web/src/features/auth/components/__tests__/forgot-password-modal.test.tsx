import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/test/test-utils';
import { ForgotPasswordModal } from '../forgot-password-modal';

vi.mock('../../hooks/use-forgot-password', () => ({
  useForgotPassword: () => ({
    sendOtpMutation: { mutateAsync: vi.fn().mockResolvedValue({ message: 'sent', debug_code: '123456' }), isPending: false },
    verifyOtpMutation: { mutateAsync: vi.fn().mockResolvedValue({ verified: true }), isPending: false },
    resetPasswordMutation: { mutateAsync: vi.fn().mockResolvedValue({ message: 'reset' }), isPending: false },
  }),
}));

describe('ForgotPasswordModal', () => {
  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <ForgotPasswordModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(screen.queryByText('نسيت كلمة المرور؟')).not.toBeInTheDocument();
  });

  it('renders step 1 when isOpen is true', () => {
    renderWithProviders(
      <ForgotPasswordModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(screen.getByText('نسيت كلمة المرور؟')).toBeInTheDocument();
    expect(screen.getByText('إرسال رمز التحقق')).toBeInTheDocument();
  });
});
