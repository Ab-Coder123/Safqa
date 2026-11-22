import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import {
  buildCorsOptions,
  securityHeadersMiddleware,
} from './common/security/http-security.config';

/**
 * Shared NestJS application bootstrap configuration used by both
 * long-lived Node servers (main.ts) and Vercel Serverless handlers (vercel-handler.ts).
 */
export function configureNestApp(app: INestApplication): INestApplication {
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp && typeof expressApp.disable === 'function') {
    expressApp.disable('x-powered-by');
  }

  app.use(securityHeadersMiddleware);
  app.enableCors(buildCorsOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  return app;
}
