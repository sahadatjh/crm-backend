import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_DATABASE ?? 'fbintbd_crm',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: false,
  }),
);
