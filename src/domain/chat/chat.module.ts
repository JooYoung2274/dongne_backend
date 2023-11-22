import { Module } from '@nestjs/common';
import { EventsGateway } from './chat.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
