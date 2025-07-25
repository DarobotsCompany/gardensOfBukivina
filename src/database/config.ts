import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getConfig() {
    const config = {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        timezone: 'UTC',
    } as TypeOrmModuleOptions;

    return config;
}
