import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomRepository } from './chat-room.repository';
import { UserModule } from '../user/user.module';
import { ChatRecordRepository } from './chat-record.repository';
import { CategoryRepository } from './category.respository';

@Module({
  imports: [UserModule],
  providers: [
    ChatRoomService,
    ChatRoomRepository,
    ChatRecordRepository,
    CategoryRepository,
  ],
  controllers: [ChatRoomController],
  exports: [ChatRoomRepository, ChatRecordRepository],
})
export class ChatRoomModule {}
