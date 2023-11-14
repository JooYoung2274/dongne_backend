import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomRepository } from './chat-room.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from '../entities/chat';
import { ChatUsers } from '../entities/chatUser';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, ChatUsers]), UserModule],
  providers: [ChatRoomService, ChatRoomRepository],
  controllers: [ChatRoomController],
})
export class ChatRoomModule {}
