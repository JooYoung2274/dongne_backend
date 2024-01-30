import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/user.decorator';
import { addFriendDto } from './dto/request.addFriend.dto';
import { Friends } from '../entities/friend';
import { deleteFriendDto } from './dto/request.deleteFriend.dto';

@ApiTags('친구 관련')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  // 친구 추가
  @ApiOperation({ summary: '친구 추가' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addFriend(@Body() body: addFriendDto, @User() user): Promise<Friends> {
    return await this.friendService.addFriend(body, user);
  }

  // 친구 삭제
  @ApiOperation({ summary: '친구 삭제' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async deleteFriend(
    @Body() body: deleteFriendDto,
    @User() user,
  ): Promise<void> {
    await this.friendService.deleteFriend(body, user);
    return;
  }
}
