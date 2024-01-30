import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class deleteFriendDto {
  @IsNumber()
  @ApiProperty({
    description: '친구리스트 ID',
    required: true,
    nullable: false,
  })
  friendId: number;
}
