import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { User } from 'src/common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Chats } from '../entities/chat';
import { joinChatRoomDto } from './dto/request.joinChatRoom.dto';
import { ChatUsers } from '../entities/chatUser';
import { changeChatRoomStatusDto } from './dto/request.changeChatRoomStatus.dto';

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

  @ApiOperation({ summary: '채팅방 리스트' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getChatRoomList(@User() user): Promise<Chats[]> {
    return this.chatRoomService.getChatRoomList(user);
  }

  @ApiOperation({ summary: '채팅방 입장' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('join')
  async joinChatRoom(
    @Body() body: joinChatRoomDto,
    @User() user,
  ): Promise<ChatUsers> {
    return await this.chatRoomService.joinChatRoom(body, user);
  }

  @ApiOperation({ summary: '채팅방 나가기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('leave')
  async leaveChatRoom(
    @Body() body: joinChatRoomDto,
    @User() user,
  ): Promise<void> {
    await this.chatRoomService.leaveChatRoom(body, user);
    return;
  }

  @ApiOperation({ summary: '이전 채팅방 기록있는지 불러오기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('record')
  async getChatRecord(@User() user): Promise<number> {
    return await this.chatRoomService.getChatRecord(user);
  }

  @ApiOperation({ summary: '채팅방 상태 변경' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('status/:chatRoomId')
  async changeChatRoomStatus(
    @Param('chatRoomId') chatRoomdId: number,
    @Body() body: changeChatRoomStatusDto,
    @User() user,
  ): Promise<void> {
    await this.chatRoomService.changeChatRoomStatus(body, user);
    return;
  }
}
