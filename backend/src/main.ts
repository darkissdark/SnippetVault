import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { configureApp } from './configure-app';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  configureApp(app);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? true,
  });

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
