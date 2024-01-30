import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { FriendRepository } from './friend.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
})
export class FriendModule {}
