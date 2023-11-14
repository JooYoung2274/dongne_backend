import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { Chats } from '../entities/chat';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async createChatRoom(body: createChatRoomDto, user): Promise<Chats> {
    // longitude
    // latitude

    const longitude = '127.127'; // longitude,
    const latitude = '37.37'; // latitude,

    const isChatRoom = await this.chatRoomRepository.findChatRoomByUserId(
      user.id,
    );

    if (isChatRoom) {
      throw new BadRequestException('이미 참여하고 있는 채팅방이 존재합니다');
    }

    const newChatRoom = await this.chatRoomRepository.createChatRoom(
      body,
      longitude,
      latitude,
    );

    await this.chatRoomRepository.createChatUser(newChatRoom.id, user.id);
    return newChatRoom;
  }
}
