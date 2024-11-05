import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  parent_department_id?: string | null;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
