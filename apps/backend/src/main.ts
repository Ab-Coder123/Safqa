import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureNestApp } from './app.bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureNestApp(app);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Safqa Backend Service running on http://localhost:${port}`);
}

bootstrap();
