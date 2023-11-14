import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from '../entities/chat';
import { Repository } from 'typeorm';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { CATEGORY_PROFILE } from 'src/constant/category-profile';
import { ChatUsers } from '../entities/chatUser';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(Chats) private chatRepository: Repository<Chats>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
  ) {}

  async createChatRoom(
    body: createChatRoomDto,
    longitude: string,
    latitude: string,
  ): Promise<Chats> {
    const newChatRoom = this.chatRepository.create();
    newChatRoom.longitude = longitude;
    newChatRoom.latitude = latitude;
    newChatRoom.categoryProfile = CATEGORY_PROFILE[body.category];
    newChatRoom.StatusId = 1;
    newChatRoom.title = body.title;
    newChatRoom.orderLink = body.orderLink;
    newChatRoom.restaurantName = body.restaurantName;
    newChatRoom.max = body.max;
    newChatRoom.dueDate = new Date(body.dueDate);
    newChatRoom.AreaId = body.AreaId;

    await this.chatRepository.save(newChatRoom);
    return newChatRoom;
  }

  async findChatRoomByUserId(userId: number): Promise<ChatUsers> {
    const result = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });
    return result;
  }

  async createChatUser(chatId: number, userId: number): Promise<ChatUsers> {
    const newChatUser = this.chatUserRepository.create();
    newChatUser.ChatId = chatId;
    newChatUser.UserId = userId;

    await this.chatUserRepository.save(newChatUser);
    return newChatUser;
  }
}
