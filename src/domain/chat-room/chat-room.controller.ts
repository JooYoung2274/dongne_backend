import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { User } from 'src/common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Chats } from '../entities/chat';

@ApiTags('채팅방')
@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createChatRoom(
    @Body() body: createChatRoomDto,
    @User() user,
  ): Promise<Chats> {
    return this.chatRoomService.createChatRoom(body, user);
  }
}
