import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const MigrationsDataSource = new DataSource({
  type: 'postgres',
  url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/database/migrations/*{.js,.ts}'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

export default MigrationsDataSource;
