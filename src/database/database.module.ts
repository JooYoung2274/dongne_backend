import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Areas } from 'src/domain/entities/area';
import { Chats } from 'src/domain/entities/chat';
import { ChatRecords } from 'src/domain/entities/chatRecord';
import { ChatUsers } from 'src/domain/entities/chatUser';
import { Statuses } from 'src/domain/entities/status';
import { Users } from 'src/domain/entities/user';
import { UserAreas } from 'src/domain/entities/userArea';

const databaseModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    return {
      type: 'postgres',
      host: process.env.DB_HOST_POSTGRES,
      port: 5432,
      username: process.env.DB_USERNAME_POSTGRES,
      password: process.env.DB_PASSWORD_POSTGRES,
      database: process.env.DB_DATABASE_POSTGRES,
      entities: [
        Users,
        Chats,
        Areas,
        ChatUsers,
        Statuses,
        UserAreas,
        ChatRecords,
      ],
      autoLoadEntities: true,
      charset: 'utf8mb4',
      synchronize: true,
      logging: true,
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
