import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
    const PORT = process.env.PORT || 3000

    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000',
    });

    app.setGlobalPrefix("api")
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();