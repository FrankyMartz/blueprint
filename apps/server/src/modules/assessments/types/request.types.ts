/* ========================================================================== *
 * Assessments: Types: Request
 * ========================================================================== */

import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  Max,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AssessmentAnswersValue,
  AssessmentQuestionsValue,
} from '@app/modules/database';

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

export class AssessmentAnswerDto {
  @IsInt()
  @Min(0)
  @Max(4)
  value: AssessmentAnswersValue['value'];

  @IsInt()
  questionId: AssessmentQuestionsValue['id'];
}

export class AssessmentRequestPostPayloadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentAnswerDto)
  answers: AssessmentAnswerDto[];
}
