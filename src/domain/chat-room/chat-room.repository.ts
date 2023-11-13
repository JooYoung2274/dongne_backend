import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from '../entities/chat';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(Chats) private chatRepository: Repository<Chats>,
  ) {}
}
