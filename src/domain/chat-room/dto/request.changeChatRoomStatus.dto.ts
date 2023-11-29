import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class changeChatRoomStatusDto {
  @IsNumber()
  @ApiProperty({ description: '상태 ID', required: true, nullable: false })
  statusId: number;
}
