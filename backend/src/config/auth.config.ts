import { registerAs } from '@nestjs/config';

import { ConfigNamespace } from './config-namespaces.enum';

export default registerAs(ConfigNamespace.Auth, () => {
  return {
    jwtSecret: process.env.JWT_SECRET || 'secret',
  };
});
