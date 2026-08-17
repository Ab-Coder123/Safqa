import type { RegisterInput } from '../types/auth.types';

type RegisterFormData = RegisterInput & {
  confirmPassword: string;
};

export function toRegisterInput(formData: RegisterFormData): RegisterInput {
  return {
    full_name: formData.full_name.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    phone_number: formData.phone_number.trim(),
    gender: formData.gender,
    birth_date: new Date(formData.birth_date).toISOString(),
  };
}
