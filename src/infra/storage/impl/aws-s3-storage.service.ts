import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from '@nest-lab/fastify-multer';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { IStorageService } from '../istorage.service.interface';

@Injectable()
export class AwsS3StorageService implements IStorageService {
  private readonly AWS_CREDENTIALS = {
    S3_BUCKET: this.configService.get<string>('aws.s3_bucket'),
    ACCESS_KEY: this.configService.get<string>('aws.access_key'),
    SECRET_ACCESS_KEY: this.configService.get<string>('aws.secret_access_key'),
    REGION: this.configService.get<string>('aws.region'),
  };
  private readonly s3Client: S3Client;
  private readonly logger: Logger = new Logger(AwsS3StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.AWS_CREDENTIALS.ACCESS_KEY,
        secretAccessKey: this.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
      },
      region: this.AWS_CREDENTIALS.REGION,
    });
  }

  async upload(file: File, path: string): Promise<string> {
    this.logger.log(`Init S3 upload to path ${path}`);

    const params = {
      Bucket: this.AWS_CREDENTIALS.S3_BUCKET,
      Key: `${path}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));

      this.logger.log(`Succesfully upload to S3 ${path}!`);

      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      this.logger.error(
        `An error has occured while trying to upload to S3:: ${error}`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An error has occured while trying to upload an image',
      );
    }
  }

  async remove(key: string): Promise<void> {
    this.logger.log(`Init S3 object remove for key ${key}`);

    const params = {
      Bucket: this.AWS_CREDENTIALS.S3_BUCKET,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(params));

      this.logger.log(`SUCCESS remove object ${key} from s3`);
    } catch (error) {
      this.logger.error(
        `An error has occured while trying to remove object from S3:: ${error}`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        `An error has occured while trying to remove object key ${key}`,
      );
    }
  }
}
