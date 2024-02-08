import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { User } from 'src/common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Chats } from '../entities/chat';
import { joinChatRoomDto } from './dto/request.joinChatRoom.dto';
import { ChatUsers } from '../entities/chatUser';
import { changeChatRoomStatusDto } from './dto/request.changeChatRoomStatus.dto';
import { paymentDto } from './dto/request.changePaymentStatus.dto';
import { kickUserDto } from './dto/request.kickUser.dto';

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
  @ApiQuery({
    name: 'category',
    required: false,
    description: '카테고리 \n전체 리스트 불러올거면 없어도 됨',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getChatRoomList(
    @User() user,
    @Query('category') category?: string,
  ): Promise<any> {
    return this.chatRoomService.getChatRoomList(user, category);
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
    await this.chatRoomService.changeChatRoomStatus(body, chatRoomdId, user);
    return;
  }

  @ApiOperation({ summary: '(참여자) 전체 입금 완료로 상태 변경하기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('payment/:chatRoomId')
  async changePaymentStatus(
    @Body() body: paymentDto,
    @Param('chatRoomId') chatRoomId: number,
    @User() user,
  ): Promise<void> {
    await this.chatRoomService.changePaymentStatus(body, chatRoomId, user);
    return;
  }

  @ApiOperation({ summary: '(방장) 참여자 강퇴하기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('kick')
  async kickUser(@Body() body: kickUserDto, @User() user): Promise<void> {
    await this.chatRoomService.kickUser(body, user);
    return;
  }
}
