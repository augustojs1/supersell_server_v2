import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as AWS from 'aws-sdk';
import { File } from '@nest-lab/fastify-multer';
import { s3UploadResponse } from '../types';

@Injectable()
export class AwsS3StorageService {
  private AWS_S3_BUCKET: string =
    this.configService.get<string>('aws.s3_bucket');
  private AWS_ACCESS_KEY: string =
    this.configService.get<string>('aws.access_key');
  private AWS_SECRET_ACCESS_KEY: string = this.configService.get<string>(
    'aws.secret_access_key',
  );
  private s3Client: any;
  private readonly logger = new Logger(AwsS3StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new AWS.S3({
      accessKeyId: this.AWS_ACCESS_KEY,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    });
  }

  async upload(file: File, path: string): Promise<s3UploadResponse> {
    this.logger.log(`Init S3 upload to path ${path}`);

    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: `${path}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response: s3UploadResponse = await this.s3Client
        .upload(params)
        .promise();

      this.logger.log(`Succesfully upload to S3 ${path}!`);

      return s3Response;
    } catch (error) {
      this.logger.log(
        `An error has occured while trying to upload to S3:: ${error}`,
      );
      throw new InternalServerErrorException(
        'An error has occured while trying to upload an image ',
      );
    }
  }
}
