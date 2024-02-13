import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class kickUserDto {
  @IsNumber()
  @ApiProperty({ description: '유저 ID', required: true, nullable: false })
  UserId: number;
}
