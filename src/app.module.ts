import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './domain/user/user.module';
import { ChatRoomModule } from './domain/chat-room/chat-room.module';
import { EventsModule } from './domain/chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    UserModule,
    ChatRoomModule,
    EventsModule,
    ServeStaticModule.forRoot({
      rootPath: './',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
