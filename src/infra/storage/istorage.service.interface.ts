import { File } from '@nest-lab/fastify-multer';

export abstract class IStorageService {
  abstract upload(file: File, path: string): Promise<any>;
  abstract remove(key: string): Promise<void>;
}
