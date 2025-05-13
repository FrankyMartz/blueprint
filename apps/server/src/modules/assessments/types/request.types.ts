/* ========================================================================== *
 * Assessments: Types: Request
 * ========================================================================== */

import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 20;
}

export class CreateAssessmentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fullName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  disorder: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName: string;
}
