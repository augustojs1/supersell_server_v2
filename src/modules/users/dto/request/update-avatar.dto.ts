import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvatarDto {
  @IsNotEmpty()
  @IsString()
  avatar_url: string;
}
