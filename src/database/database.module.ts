import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Areas } from 'src/domain/entities/area';
import { Chats } from 'src/domain/entities/chat';
import { ChatUsers } from 'src/domain/entities/chatUser';
import { Statuses } from 'src/domain/entities/status';
import { Users } from 'src/domain/entities/user';
import { UserAreas } from 'src/domain/entities/userArea';

const databaseModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [Users, Chats, Areas, ChatUsers, Statuses, UserAreas],
      autoLoadEntities: true,
      charset: 'utf8mb4',
      synchronize: true,
      logging: true,
      // keepConnectionAlive: true,
    };
  },
});

@Module({
  imports: [databaseModule],
  exports: [databaseModule],
})
export class DatabaseModule {
  public static forRoot() {
    return {
      module: DatabaseModule,
    };
  }
}
