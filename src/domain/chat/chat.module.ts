import { Module } from '@nestjs/common';
import { EventsGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { ChatRoomModule } from '../chat-room/chat-room.module';

@Module({
  imports: [UserModule, ChatRoomModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
