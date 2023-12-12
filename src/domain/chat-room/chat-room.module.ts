import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomRepository } from './chat-room.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from '../entities/chat';
import { ChatUsers } from '../entities/chatUser';
import { UserModule } from '../user/user.module';
import { ChatRecords } from '../entities/chatRecord';
import { ChatRecordRepository } from './chat-record.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chats, ChatUsers, ChatRecords]),
    UserModule,
  ],
  providers: [ChatRoomService, ChatRoomRepository, ChatRecordRepository],
  controllers: [ChatRoomController],
  exports: [ChatRoomRepository, ChatRecordRepository],
})
export class ChatRoomModule {}
