import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatRecords } from '../entities/chatRecord';

@Injectable()
export class ChatRecordRepository extends Repository<ChatRecords> {
  constructor(private dataSource: DataSource) {
    super(ChatRecords, dataSource.createEntityManager());
  }

  async createChatRecord(
    chatId: number,
    message: string,
    userId: number,
  ): Promise<void> {
    const newChatRecord = this.create();
    newChatRecord.ChatId = chatId;
    newChatRecord.message = message;
    newChatRecord.UserId = userId;

    await this.save(newChatRecord);
  }

  async getChatRecord(chatId): Promise<ChatRecords[]> {
    const result = await this.find({
      where: { ChatId: chatId },
    });
    return result;
  }
}
