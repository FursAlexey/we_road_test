import { registerAs } from '@nestjs/config';
import { join } from 'path';

import { ConfigNamespace } from './config-namespaces.enum';

const entitiesPath = join(__dirname, '..', '/**/*.entity.{js,ts}');
const migrationsPath = join(__dirname, '..', '/database/migrations/*.ts');

export const getDBConfig = () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port:
    process.env.POSTGRES_PORT ||
    (process.env.NODE_ENV !== 'test' ? 5432 : 5423),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: process.env.NODE_ENV === 'test',
});

export default registerAs(ConfigNamespace.Database, () => {
  return getDBConfig();
});
