import type { IUser, UserGender, UserRole, UserStatus } from '@safqa/types';
import type { Product } from '../../products/types/products.types';

export interface UpdateProfileInput {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  gender?: UserGender;
}

export interface UserProfileResponse {
  user: IUser & {
    birth_date?: string;
    gender?: UserGender;
    avatar_url?: string;
    status?: UserStatus;
    role?: UserRole;
    created_at?: string;
    updated_at?: string;
    products?: Product[];
    _count?: {
      products: number;
    };
  };
}
