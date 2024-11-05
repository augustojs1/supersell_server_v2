import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashProvider {
  public async hashData(data: string): Promise<string> {
    const SALT_ROUNDS = 10;

    return await bcrypt.hash(data, SALT_ROUNDS);
  }

  public async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
