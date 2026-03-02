import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 2. Dynamic CORS Configuration
  // Add your Vercel URL here once you deploy the frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'mayaz-fit-one.vercel.app',

      /\.vercel\.app$/, // Allows all Vercel preview deployments
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // 3. Cloud-Ready Port Logic
  // Railway provides the PORT variable; default to 3001 for local dev
  const port = process.env.PORT || 3001;

  // 4. Listen on all network interfaces ('0.0.0.0')
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();