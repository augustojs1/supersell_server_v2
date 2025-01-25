import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;
}
