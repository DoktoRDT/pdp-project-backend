import * as path from 'path';
import { ConfigService } from './shared/services';

const config = new ConfigService();
const src = process.env.NODE_ENV === 'production' ? '.' : 'src';

module.exports = {
  type: 'postgres',
  name: 'postgres',
  ...config.postgresConfig,
  migrations: [ path.resolve(`${src}/migrations/*.{ts,js}`) ],
};
