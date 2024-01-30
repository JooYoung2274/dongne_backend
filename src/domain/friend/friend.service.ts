import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendRepository } from './friend.repository';
import { addFriendDto } from './dto/request.addFriend.dto';
import { Friends } from '../entities/friend';
import { deleteFriendDto } from './dto/request.deleteFriend.dto';

@Injectable()
export class FriendService {
  constructor(private friendRepository: FriendRepository) {}

  async addFriend(body: addFriendDto, user): Promise<Friends> {
    const { userId: friendId } = body;
    const { id } = user;

    const isFriend = await this.friendRepository.findOne({
      where: { FriendId: friendId, UserId: id },
    });

    if (isFriend) {
      throw new BadRequestException('이미 친구입니다.');
    }

    return await this.friendRepository.addFriend(friendId, id);
  }

  async deleteFriend(body: deleteFriendDto, user): Promise<void> {
    const { friendId } = body;
    const { id } = user;

    const isFriend = await this.friendRepository.findOne({
      where: { id: friendId },
    });

    if (isFriend.UserId !== id) {
      throw new BadRequestException('잘못된 접근');
    }

    await this.friendRepository.delete({ id: friendId });
  }
}
