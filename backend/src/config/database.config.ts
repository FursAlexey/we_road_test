import { registerAs } from '@nestjs/config';

import { ConfigNamespace } from './config-namespaces.enum';
import { join } from 'path';

const entitiesPath = join(__dirname, '..', '/**/*.entity.{js,ts}');
const migrationsPath = join(__dirname, '..', '/database/migrations/*.ts');

export const getDBConfig = () => ({
  type: 'postgres',
  host: 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
});

export default registerAs(ConfigNamespace.Database, () => {
  return getDBConfig();
});
