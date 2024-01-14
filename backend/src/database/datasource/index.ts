import { DataSource, DataSourceOptions } from 'typeorm';

import { getDBConfig } from '../../config/database.config';

import 'dotenv/config';

const dataSource = new DataSource(getDBConfig() as DataSourceOptions);

export default dataSource;
