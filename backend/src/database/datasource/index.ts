import { DataSource, DataSourceOptions } from 'typeorm';

export const datasourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'we_road',
  entities: [__dirname + '/../../**/*.entity.ts'],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: false,
};

const dataSource = new DataSource(datasourceConfig);

export default dataSource;
