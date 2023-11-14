import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class joinChatRoomDto {
  @IsNumber()
  @ApiProperty({ description: '채팅방 ID', required: true, nullable: false })
  ChatRoomId: number;
}
