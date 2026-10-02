/**
 * Resolves a full media URL from a relative path or external URL.
 * If the URL is relative (e.g. /uploads/image.jpg), it prefixes it with the backend API URL.
 */
export function getMediaUrl(url?: string | null): string {
  if (!url) {
    return 'https://placehold.co/600x400/0f766e/ffffff?text=صفقة';
  }

  // Already a full URL or blob/data URI
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const cleanBase = apiBase.replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBase}${cleanPath}`;
}
