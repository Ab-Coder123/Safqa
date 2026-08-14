// ==========================================
// Business Constants
// ==========================================

export const CONSTANTS = {
  MAX_DAILY_POSTS: 3,
  NOTIFICATION_EXPIRY_DAYS: 3,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_CURRENCY: 'EGP',
};

// ==========================================
// Formatting Helpers
// ==========================================

export function formatPrice(price: number | string, currency: string = CONSTANTS.DEFAULT_CURRENCY): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return `0 ${currency}`;
  return `${numericPrice.toLocaleString('ar-EG')} ${currency}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0621-\u064A-]+/g, '')
    .replace(/--+/g, '-');
}

// ==========================================
// Validation Helpers
// ==========================================

export function isValidEgyptianPhone(phone: string): boolean {
  const regex = /^(010|011|012|015)\d{8}$/;
  return regex.test(phone.trim());
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}
