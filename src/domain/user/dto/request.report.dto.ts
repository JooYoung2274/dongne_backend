import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ReportReason } from 'src/constant/report-reason';

export class reportDto {
  @IsNumber()
  @ApiProperty({
    description: '신고할 유저의 id',
    required: true,
    example: 1,
  })
  UserId: number;

  @IsEnum(ReportReason)
  @ApiProperty({
    description: '신고 사유',
    required: true,
    example: ReportReason.SPAM,
  })
  reason: ReportReason;
}
