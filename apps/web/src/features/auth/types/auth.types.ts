import type { IUser } from '@safqa/types';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
};

export type RegisterInput = {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  birth_date: string;
  avatar_url?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  user: IUser;
  tokens: AuthTokens;
};

export type RefreshResponse = {
  tokens: AuthTokens;
};

export type CurrentUserResponse = {
  user: IUser;
};
