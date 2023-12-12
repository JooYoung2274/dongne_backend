import { Injectable } from '@nestjs/common';
import { Chats } from '../entities/chat';
import { DataSource, Repository } from 'typeorm';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { CATEGORY_PROFILE } from 'src/constant/category-profile';

@Injectable()
export class ChatRoomRepository extends Repository<Chats> {
  constructor(private dataSource: DataSource) {
    super(Chats, dataSource.createEntityManager());
  }

  async createChatRoom(body: createChatRoomDto): Promise<Chats> {
    const newChatRoom = this.create();
    newChatRoom.categoryProfile = CATEGORY_PROFILE[body.category];
    newChatRoom.StatusId = 1;
    newChatRoom.title = body.title;
    newChatRoom.orderLink = body.orderLink;
    newChatRoom.longitude = body.longitude;
    newChatRoom.latitude = body.latitude;
    newChatRoom.restaurantName = body.restaurantName;
    newChatRoom.max = body.max;
    newChatRoom.deliveryFee = body.deliveryFee;
    newChatRoom.dueDate = new Date(body.dueDate);
    newChatRoom.AreaId = body.AreaId;
    newChatRoom.isAllPaid = false;
    await this.save(newChatRoom);
    return newChatRoom;
  }

  async getChatRoomList(AreaId: number): Promise<any> {
    const data = await this.createQueryBuilder('chat')
      .leftJoin('chat.ChatUser', 'chatUser')
      .leftJoin('chatUser.User', 'user')
      .leftJoin('user.UserArea', 'userArea')
      .where('userArea.AreaId = :AreaId', { AreaId })
      .addSelect('COUNT(chatUser.ChatId)', 'count')
      .groupBy('chat.id')
      .getRawMany();

    const result = data.map((chat) => ({
      title: chat.chat_title,
      count: chat.count,
      id: chat.chat_id,
      orderLink: chat.chat_orderLink,
      logitude: chat.chat_longitude,
      latitude: chat.chat_latitude,
      restaurantName: chat.chat_restaurantName,
      categoryProfile: chat.chat_categoryProfile,
      max: chat.chat_max,
      deliveryFee: chat.chat_deliveryFee,
      isAllPaid: chat.chat_isAllPaid,
      createdAt: chat.chat_createdAt,
      dueDate: chat.chat_dueDate,
      StatusId: chat.chat_StatusId,
      AreaId: chat.chat_AreaId,
    }));

    return result;
  }

  async deleteChatRoom(chatId) {
    await this.delete({ id: chatId });
  }

  async findOneById(id: number): Promise<Chats> {
    const result = await this.findOne({
      where: { id },
    });
    return result;
  }

  async updateChatRoomStatus(id: number, statusId: number) {
    const isChatRoom = await this.findOne({ where: { id } });
    isChatRoom.StatusId = statusId;
    await this.save(isChatRoom);
  }

  async updateChatRoomMax(chatRoomId: number, newMax: number) {
    // queryRunner 로 업데이트

    const isChatRoom = await this.findOne({
      where: { id: chatRoomId },
    });
    isChatRoom.max = newMax;
    await this.save(isChatRoom);
  }
}
