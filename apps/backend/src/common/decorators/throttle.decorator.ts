import { SetMetadata } from '@nestjs/common';

export const THROTTLE_OPTIONS_KEY = 'throttle_options';
export const SKIP_THROTTLE_KEY = 'skip_throttle';

export interface ThrottleOptions {
  limit: number; // Maximum number of requests within the ttl window
  ttl: number;   // Time window in seconds
}

/**
 * Custom decorator to configure rate limiting on controllers or routes.
 * @param options ThrottleOptions { limit, ttl }
 */
export const Throttle = (options: ThrottleOptions) =>
  SetMetadata(THROTTLE_OPTIONS_KEY, options);

/**
 * Decorator to bypass rate limiting for a specific route or controller.
 */
export const SkipThrottle = () => SetMetadata(SKIP_THROTTLE_KEY, true);
