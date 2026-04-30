import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Global HTTP semantics shared between production bootstrap and e2e tests.
 */
export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );
}
