import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class paymentDto {
  @IsNumber()
  @ApiProperty({ description: '지불금액', required: true, nullable: false })
  amount: number;
}
