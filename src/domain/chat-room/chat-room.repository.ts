import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from '../entities/chat';
import { Repository } from 'typeorm';
import { createChatRoomDto } from './dto/request.createChatRoom.dto';
import { CATEGORY_PROFILE } from 'src/constant/category-profile';
import { ChatUsers } from '../entities/chatUser';
import { ChatRecords } from '../entities/chatRecord';
import { paymentDto } from './dto/request.changePaymentStatus.dto';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(Chats) private chatRepository: Repository<Chats>,
    @InjectRepository(ChatUsers)
    private chatUserRepository: Repository<ChatUsers>,
    @InjectRepository(ChatRecords)
    private chatRecordRepository: Repository<ChatRecords>,
  ) {}

  async createChatRoom(body: createChatRoomDto): Promise<Chats> {
    const newChatRoom = this.chatRepository.create();
    newChatRoom.categoryProfile = CATEGORY_PROFILE[body.category];
    newChatRoom.StatusId = 1;
    newChatRoom.title = body.title;
    newChatRoom.orderLink = body.orderLink;
    newChatRoom.longitude = body.longitude;
    newChatRoom.latitude = body.latitude;
    newChatRoom.restaurantName = body.restaurantName;
    newChatRoom.max = body.max;
    newChatRoom.dueDate = new Date(body.dueDate);
    newChatRoom.AreaId = body.AreaId;
    newChatRoom.isAllPaid = false;
    await this.chatRepository.save(newChatRoom);
    return newChatRoom;
  }

  async findChatUserByUserId(userId: number): Promise<ChatUsers> {
    const result = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });
    return result;
  }

  async createChatUser(
    chatId: number,
    userId: number,
    isHost: boolean,
  ): Promise<ChatUsers> {
    const newChatUser = this.chatUserRepository.create();
    newChatUser.ChatId = chatId;
    newChatUser.UserId = userId;
    newChatUser.isHost = isHost;
    newChatUser.isPaid = false;
    await this.chatUserRepository.save(newChatUser);
    return newChatUser;
  }

  async getChatRoomList(AreaId: number): Promise<Chats[]> {
    const result = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.ChatUser', 'chatUser')
      .leftJoin('chatUser.User', 'user')
      .leftJoin('user.UserArea', 'userArea')
      .where('userArea.AreaId = :AreaId', { AreaId })
      .getMany();

    return result;
  }

  async deleteChatUser(chatUserId): Promise<void> {
    await this.chatUserRepository.delete(chatUserId);
  }

  async createChatRecord(
    chatId: number,
    message: string,
    userId: number,
  ): Promise<void> {
    const newChatRecord = this.chatRecordRepository.create();
    newChatRecord.ChatId = chatId;
    newChatRecord.message = message;
    newChatRecord.UserId = userId;

    await this.chatRecordRepository.save(newChatRecord);
  }

  async getChatRecord(chatId): Promise<ChatRecords[]> {
    const result = await this.chatRecordRepository.find({
      where: { ChatId: chatId },
    });
    return result;
  }

  async deleteChatRoom(chatId) {
    await this.chatRepository.delete(chatId);
  }

  async findOneById(id: number): Promise<Chats> {
    const result = await this.chatRepository.findOne({
      where: { id },
    });
    return result;
  }

  async updateChatRoomStatus(id: number, statusId: number) {
    const isChatRoom = await this.chatRepository.findOne({ where: { id } });
    isChatRoom.StatusId = statusId;
    await this.chatRepository.save(isChatRoom);
  }

  async updatePaymentStatus(body: paymentDto, id: number) {
    const isChatUser = await this.chatUserRepository.findOne({
      where: { ChatId: id },
    });
    isChatUser.isPaid = true;
    isChatUser.amount = body.amount;
    isChatUser.paidAt = new Date();
    await this.chatUserRepository.save(isChatUser);
  }

  async findChatUserList(chatRoomId: number) {
    const result = await this.chatUserRepository.find({
      where: { ChatId: chatRoomId },
    });
    return result;
  }

  async findChatUserisPaidList(chatRoomId: number) {
    const result = await this.chatUserRepository.find({
      where: { ChatId: chatRoomId, isPaid: true },
    });
    return result;
  }
}
