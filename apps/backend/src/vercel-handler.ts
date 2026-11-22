import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { configureNestApp } from './app.bootstrap';

type ExpressHandler = (req: Request, res: Response) => unknown;

let cachedHandler: ExpressHandler | null = null;
let initPromise: Promise<ExpressHandler> | null = null;

/**
 * Initializes the NestJS application once per warm Vercel Serverless container
 * and returns the underlying Express request handler.
 */
export async function getVercelHandler(): Promise<ExpressHandler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
      });
      configureNestApp(app);
      await app.init();
      const expressInstance = app.getHttpAdapter().getInstance() as ExpressHandler;
      cachedHandler = expressInstance;
      return expressInstance;
    })();
  }

  return initPromise;
}
