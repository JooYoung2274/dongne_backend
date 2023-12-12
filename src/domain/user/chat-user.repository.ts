import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatUsers } from '../entities/chatUser';
import { paymentDto } from '../chat-room/dto/request.changePaymentStatus.dto';

@Injectable()
export class ChatUserRepository extends Repository<ChatUsers> {
  constructor(private dataSource: DataSource) {
    super(ChatUsers, dataSource.createEntityManager());
  }

  async findChatUserByUserId(userId: number): Promise<ChatUsers> {
    const result = await this.findOne({
      where: { UserId: userId },
    });
    return result;
  }

  async createChatUser(
    chatId: number,
    userId: number,
    isHost: boolean,
    isPaid: boolean,
  ): Promise<ChatUsers> {
    const newChatUser = this.create();
    newChatUser.ChatId = chatId;
    newChatUser.UserId = userId;
    newChatUser.isHost = isHost;
    newChatUser.isPaid = isPaid;
    await this.save(newChatUser);
    return newChatUser;
  }

  async deleteChatUser(chatUserId): Promise<void> {
    await this.delete({ id: chatUserId });
  }

  async updatePaymentStatus(body: paymentDto, id: number) {
    const isChatUser = await this.findOne({
      where: { ChatId: id },
    });
    isChatUser.isPaid = true;
    isChatUser.amount = body.amount;
    isChatUser.paidAt = new Date();
    await this.save(isChatUser);
  }

  async findChatUserList(chatRoomId: number) {
    const result = await this.find({
      where: { ChatId: chatRoomId },
    });
    return result;
  }

  async findChatUserisPaidList(chatRoomId: number, isPaid: boolean) {
    const result = await this.find({
      where: { ChatId: chatRoomId, isPaid: isPaid },
    });
    return result;
  }
}
