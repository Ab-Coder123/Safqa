import { IsEnum, IsUUID, IsString, MinLength, MaxLength } from 'class-validator';
import { ReportTargetType } from '@safqa/types';

export class CreateReportDto {
  @IsEnum(ReportTargetType, { message: 'Target type must be PRODUCT, USER, or COMMENT' })
  target_type!: ReportTargetType;

  @IsUUID('4', { message: 'target_id must be a valid UUID' })
  target_id!: string;

  @IsString()
  @MinLength(5, { message: 'Reason must be at least 5 characters long' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  reason!: string;
}
