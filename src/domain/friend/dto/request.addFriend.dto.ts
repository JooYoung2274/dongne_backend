import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class addFriendDto {
  @IsNumber()
  @ApiProperty({ description: '친구 ID', required: true, nullable: false })
  userId: number;
}
