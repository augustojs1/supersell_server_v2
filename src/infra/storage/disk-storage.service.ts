import * as fs from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { StorageEngine } from '@nest-lab/fastify-multer';

export class DiskStorageService implements StorageEngine {
  constructor(private uploadPath: string) {}

  _handleFile(
    req: any,
    file: any,
    cb: (
      error?: any,
      info?: Partial<import('@nest-lab/fastify-multer').File>,
    ) => void,
  ): void {
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, filename);

    fs.mkdirSync(this.uploadPath, { recursive: true });

    const outStream = fs.createWriteStream(filePath);

    if (file.stream instanceof Readable) {
      file.stream.pipe(outStream);
    } else {
      cb(new Error('File stream is not readable'));
      return;
    }

    outStream.on('error', cb);
    outStream.on('finish', () => {
      cb(null, { path: filePath, size: outStream.bytesWritten });
    });
  }

  _removeFile(req: any, file: any, cb: (error?: any) => void): void {
    fs.unlink(file.path, cb);
  }
}
