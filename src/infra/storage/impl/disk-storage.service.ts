import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

import { IStorageService } from '../istorage.service.interface';

export class DiskStorageService implements IStorageService {
  private readonly logger: Logger = new Logger(DiskStorageService.name);

  async upload(file: File, dir: string): Promise<string> {
    const rootPath = path.resolve('./');
    const fullpath = path.join(rootPath, './.temp', dir);

    this.logger.log(`Init writing file to path ${fullpath}`);

    if (!fs.existsSync(fullpath)) {
      fs.mkdirSync(fullpath, { recursive: true });
    }

    const filePath = `${fullpath}/${file.originalname}`;

    try {
      fs.writeFileSync(filePath, file.buffer);

      this.logger.log(`SUCCESS writing file ${filePath}`);

      return filePath;
    } catch (error) {
      this.logger.log(`ERROR writing file ${filePath}:: ${error}`);
      console.log('Error writing file', error);
    }
  }

  public async remove(dir: string): Promise<void> {
    try {
      fs.unlinkSync(dir);

      this.logger.log(`SUCCESS removing file ${dir}`);
    } catch (error) {
      this.logger.log(`ERROR removing file ${dir}:: ${error}`);
      console.log('Error removing file', error);
    }
  }
}
