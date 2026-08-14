// ==========================================
// Enums
// ==========================================

export enum UserRole {
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
  ARCHIVED = 'ARCHIVED',
}

export enum ProductCondition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED',
}

export enum NotificationType {
  COMMENT = 'COMMENT',
  SYSTEM = 'SYSTEM',
  MODERATION = 'MODERATION',
  PROMOTION = 'PROMOTION',
}

export enum ReportTargetType {
  PRODUCT = 'PRODUCT',
  USER = 'USER',
  COMMENT = 'COMMENT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum MediaEntityType {
  PRODUCT = 'PRODUCT',
  USER = 'USER',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

// ==========================================
// Entity Interfaces
// ==========================================

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: UserGender;
  birth_date: Date | string;
  avatar_url?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IProduct {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ProductCondition;
  whatsapp_number: string;
  status: ProductStatus;
  created_at: Date | string;
  updated_at: Date | string;
  user?: IUser;
  category?: ICategory;
  media?: IMedia[];
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon_url?: string | null;
  parent_id?: string | null;
  created_at: Date | string;
  parent?: ICategory | null;
  children?: ICategory[];
}

export interface IConversation {
  id: string;
  user_one_id: string;
  user_two_id: string;
  product_id?: string | null;
  last_message_at?: Date | string | null;
  created_at: Date | string;
  user_one?: IUser;
  user_two?: IUser;
  messages?: IMessage[];
}

export interface IMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: Date | string;
  sender?: IUser;
}

export interface IFavorite {
  user_id: string;
  product_id: string;
  created_at: Date | string;
  user?: IUser;
  product?: IProduct;
}

export interface INotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date | string;
}

export interface IReport {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: Date | string;
  reporter?: IUser;
}

export interface IMedia {
  id: string;
  entity_type: MediaEntityType;
  entity_id: string;
  url: string;
  type: MediaType;
  order: number;
  created_at: Date | string;
}

// ==========================================
// API & Pagination Types
// ==========================================

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}
