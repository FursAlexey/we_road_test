import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  async getHash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(data, salt);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
