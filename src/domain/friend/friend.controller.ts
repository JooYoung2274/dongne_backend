import { Controller } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('친구 관련')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}
}
