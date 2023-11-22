import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { Chats } from '../entities/chat';
import { UserRepository } from '../user/user.repository';
import { joinChatRoomDto } from './dto/request.joinChatRoom.dto';
import { ChatUsers } from '../entities/chatUser';

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

    await this.chatRoomRepository.createChatUser(newChatRoom.id, user.id);
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

    return await this.chatRoomRepository.createChatUser(
      body.ChatRoomId,
      user.id,
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

    await this.chatRoomRepository.deleteChatUser(isChatUser.id);
    return;
  }
}
