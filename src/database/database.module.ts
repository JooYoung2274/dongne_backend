import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Areas } from 'src/domain/entities/area';
import { Chats } from 'src/domain/entities/chat';
import { ChatRecords } from 'src/domain/entities/chatRecord';
import { ChatUsers } from 'src/domain/entities/chatUser';
import { Friends } from 'src/domain/entities/friend';
import { Statuses } from 'src/domain/entities/status';
import { Users } from 'src/domain/entities/user';
import { UserAreas } from 'src/domain/entities/userArea';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const databaseModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    return {
      type: 'postgres',
      host: process.env.DB_HOST_POSTGRES,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_POSTGRES,
      entities: [
        Users,
        Chats,
        Areas,
        ChatUsers,
        Statuses,
        UserAreas,
        ChatRecords,
        Friends,
      ],
      autoLoadEntities: true,
      charset: 'utf8mb4',
      synchronize: true,
      logging: true,
    };
  },
  dataSourceFactory: async (options) => {
    if (!options) {
      throw new Error('Invalid options passed');
    }

    return addTransactionalDataSource({
      name: 'default',
      dataSource: new DataSource(options),
    });
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
