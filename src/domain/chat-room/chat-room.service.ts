import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { Chats } from '../entities/chat';
import { UserRepository } from '../user/user.repository';
import { joinChatRoomDto } from './dto/request.joinChatRoom.dto';
import { ChatUsers } from '../entities/chatUser';
import { changeChatRoomStatusDto } from './dto/request.changeChatRoomStatus.dto';

@Injectable()
export class ChatRoomService {
  KAKAP_KEY = process.env.KAKAO_KEY;
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createChatRoom(body: createChatRoomDto, user): Promise<Chats> {
    const isChatRoom = await this.chatRoomRepository.findChatUserByUserId(
      user.id,
    );

    if (isChatRoom) {
      throw new BadRequestException('이미 참여하고 있는 채팅방이 존재합니다');
    }

    const newChatRoom = await this.chatRoomRepository.createChatRoom(body);

    await this.chatRoomRepository.createChatUser(newChatRoom.id, user.id, true);
    return newChatRoom;
  }

  async getChatRoomList(user): Promise<Chats[]> {
    const isUserArea = await this.userRepository.findUserAreaByUserId(user.id);

    return await this.chatRoomRepository.getChatRoomList(isUserArea.AreaId);
  }

  async joinChatRoom(body: joinChatRoomDto, user): Promise<ChatUsers> {
    const isChatUser = await this.chatRoomRepository.findChatUserByUserId(
      user.id,
    );

    if (isChatUser) {
      throw new BadRequestException('이미 참여하고 있는 채팅방이 존재합니다');
    }

    const isUser = await this.userRepository.findOneById(user.id);

    // 채팅기록 db에 message 저장
    await this.chatRoomRepository.createChatRecord(
      body.ChatRoomId,
      `${isUser.nickname}님이 입장하셨습니다.`,
      user.id,
    );

    return await this.chatRoomRepository.createChatUser(
      body.ChatRoomId,
      user.id,
      false,
    );
  }

  async leaveChatRoom(body: joinChatRoomDto, user): Promise<void> {
    const isChatUser = await this.chatRoomRepository.findChatUserByUserId(
      user.id,
    );

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    if (isChatUser.ChatId !== body.ChatRoomId) {
      throw new BadRequestException('잘못된 접근입니다');
    }

    const isUser = await this.userRepository.findOneById(user.id);

    // 채팅기록 db에 message 저장
    await this.chatRoomRepository.createChatRecord(
      body.ChatRoomId,
      `${isUser.nickname}님이 퇴장하셨습니다.`,
      user.id,
    );

    await this.chatRoomRepository.deleteChatUser(isChatUser.id);

    if (isChatUser.isHost) {
      await this.chatRoomRepository.deleteChatRoom(body.ChatRoomId);
    }

    return;
  }

  async getChatRecord(user): Promise<number> {
    const isChatUser = await this.chatRoomRepository.findChatUserByUserId(
      user.id,
    );

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    return isChatUser.ChatId;
  }

  async changeChatRoomStatus(body: changeChatRoomStatusDto, user) {
    const isChatUser = await this.chatRoomRepository.findChatUserByUserId(
      user.id,
    );

    if (!isChatUser) {
      throw new BadRequestException('참여하고 있는 채팅방이 없습니다');
    }

    if (!isChatUser.isHost) {
      throw new BadRequestException('방장만 변경할 수 있습니다');
    }

    // 현재 룸 정보 찾아서
    const isChatRoom = await this.chatRoomRepository.findOneById(
      isChatUser.ChatId,
    );

    // 현재 룸의 상태가 변경하려는 상태와 같으면 에러
    if (isChatRoom.StatusId === body.statusId) {
      throw new BadRequestException('이미 변경하려는 상태입니다');
    }

    // 현재 룸의 상태가 두단계 이상 차이나면 에러
    if (isChatRoom.StatusId - body.statusId > 1) {
      throw new BadRequestException('두 단계 이상 변경입니다. 확인해주세요!');
    }

    await this.chatRoomRepository.updateChatRoomStatus(
      isChatUser.ChatId,
      body.statusId,
    );

    return;
  }
}
