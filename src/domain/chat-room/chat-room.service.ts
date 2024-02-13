import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { Chats } from '../entities/chat';
import { UserRepository } from '../user/user.repository';
import { joinChatRoomDto } from './dto/request.joinChatRoom.dto';
import { ChatUsers } from '../entities/chatUser';
import { changeChatRoomStatusDto } from './dto/request.changeChatRoomStatus.dto';
import { paymentDto } from './dto/request.changePaymentStatus.dto';
import { Transactional } from 'typeorm-transactional';
import { UserAreaRepository } from '../user/user-area.repository';
import { ChatUserRepository } from '../user/chat-user.repository';
import { ChatRecordRepository } from './chat-record.repository';
import { CategoryRepository } from './category.respository';
import { kickUserDto } from './dto/request.kickUser.dto';

@Injectable()
export class ChatRoomService {
  KAKAP_KEY = process.env.KAKAO_KEY;
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatUserRepository: ChatUserRepository,
    private readonly chatRecordRepository: ChatRecordRepository,
    private readonly userRepository: UserRepository,
    private readonly userAreaRepository: UserAreaRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  @Transactional()
  async createChatRoom(body: createChatRoomDto, user): Promise<Chats> {
    const { max, deliveryFee } = body;
    const { id: userId } = user;
    if (deliveryFee % max) {
      throw new BadRequestException('배달비는 인원수로 나누어 떨어져야 합니다');
    }

    const isChatRoom = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (isChatRoom) {
      throw new BadRequestException('이미 참여하고 있는 채팅방이 존재합니다');
    }

    const newChatRoom = await this.chatRoomRepository.createChatRoom(body);

    await this.chatUserRepository.createChatUser(
      newChatRoom.id,
      user.id,
      true,
      true,
    );

    return newChatRoom;
  }

  async getChatRoomList(user, category?: string): Promise<any> {
    const { id: userId } = user;
    const isUserArea = await this.userAreaRepository.findOne({
      where: { UserId: userId },
    });

    if (category) {
      const isCategory = await this.categoryRepository.findOne({
        where: { name: category },
      });
      if (!isCategory) {
        throw new BadRequestException('잘못된 카테고리입니다');
      }
      await this.chatRoomRepository.getChatRoomList(
        isUserArea.AreaId,
        isCategory.id,
      );
    }

    return await this.chatRoomRepository.getChatRoomList(isUserArea.AreaId);
  }

  @Transactional()
  async joinChatRoom(body: joinChatRoomDto, user): Promise<ChatUsers> {
    const { id: userId } = user;

    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (isChatUser) {
      throw new BadRequestException('이미 참여하고 있는 채팅방이 존재합니다');
    }

    const isUser = await this.userRepository.findOne({ where: { id: userId } });

    // 채팅기록 db에 message 저장
    await this.chatRecordRepository.createChatRecord(
      body.ChatRoomId,
      `${isUser.nickname}님이 입장하셨습니다.`,
      user.id,
    );

    const result = await this.chatUserRepository.createChatUser(
      body.ChatRoomId,
      user.id,
      false,
      false,
    );

    return result;
  }

  @Transactional()
  async leaveChatRoom(body: joinChatRoomDto, user): Promise<void> {
    const { id: userId } = user;

    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    if (isChatUser.ChatId !== body.ChatRoomId) {
      throw new BadRequestException('잘못된 접근입니다');
    }

    const isUser = await this.userRepository.findOne({ where: { id: userId } });

    // 채팅기록 db에 message 저장
    await this.chatRecordRepository.createChatRecord(
      body.ChatRoomId,
      `${isUser.nickname}님이 퇴장하셨습니다.`,
      user.id,
    );

    await this.chatUserRepository.deleteChatUser(isChatUser.id);

    if (isChatUser.isHost) {
      await this.chatRoomRepository.deleteChatRoom(body.ChatRoomId);
    }

    return;
  }

  async getChatRecord(user): Promise<number> {
    const { id: userId } = user;
    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    return isChatUser.ChatId;
  }

  @Transactional()
  async changeChatRoomStatus(
    body: changeChatRoomStatusDto,
    chatRoomId: number,
    user,
  ) {
    const { id: userId } = user;
    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    if (isChatUser.ChatId !== +chatRoomId) {
      throw new BadRequestException('잘못된 접근입니다');
    }

    if (!isChatUser.isHost) {
      throw new BadRequestException('방장만 변경할 수 있습니다');
    }

    // 현재 룸 정보 찾아서
    const isChatRoom = await this.chatRoomRepository.findOne({
      where: { id: isChatUser.ChatId },
    });

    // 현재 룸의 상태가 변경하려는 상태와 같으면 에러
    if (isChatRoom.StatusId === body.statusId) {
      throw new BadRequestException('이미 변경하려는 상태입니다');
    }

    // 변경하려는 룸의 상태가 두단계 이상 차이나면 에러
    if (isChatRoom.StatusId - body.statusId > 1) {
      throw new BadRequestException('두 단계 이상 변경입니다. 확인해주세요!');
    }

    if (body.statusId === 3) {
      const isChatUserList = await this.chatUserRepository.find({
        where: { ChatId: chatRoomId, isPaid: false },
      });
      if (isChatUserList.length) {
        throw new BadRequestException('아직 입금하지 않은 인원이 있습니다');
      }
    }

    if (body.statusId === 2) {
      // chatUser 인원 찾고 max랑 비교해서 다르면 chatRoom의 max 변경
      const isChatUserList = await this.chatUserRepository.find({
        where: { ChatId: chatRoomId },
      });
      if (isChatUserList.length < isChatRoom.max) {
        await this.chatRoomRepository.updateChatRoomMax(
          chatRoomId,
          isChatUserList.length,
        );
      }
    }

    await this.chatRoomRepository.updateChatRoomStatus(
      isChatUser.ChatId,
      body.statusId,
    );

    return;
  }

  @Transactional()
  async changePaymentStatus(body: paymentDto, id: number, user) {
    const { id: userId } = user;
    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    await this.chatUserRepository.updatePaymentStatus(body, id);

    const isChatUserisPaidList = await this.chatUserRepository.find({
      where: { ChatId: id, isPaid: true },
    });
    const isChatRoom = await this.chatRoomRepository.findOne({ where: { id } });

    if (isChatUserisPaidList.length === isChatRoom.max) {
      await this.chatRoomRepository.updateChatRoomStatus(id, 5);
    }

    return;
  }

  async kickUser(body: kickUserDto, user): Promise<void> {
    const { UserId } = body;
    const { id: userId } = user;

    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    if (!isChatUser.isHost) {
      throw new BadRequestException('방장만 변경할 수 있습니다');
    }

    await this.chatUserRepository.delete({ UserId });
  }
}
