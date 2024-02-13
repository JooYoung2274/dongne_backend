import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class blockDto {
  @IsNumber()
  @ApiProperty({
    description: '차단할 유저의 id',
    required: true,
    example: 1,
  })
  UserId: number;
}
