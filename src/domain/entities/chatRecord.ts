import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user';
import { Chats } from './chat';

@Entity('chatRecords')
export class ChatRecords {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'message' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { name: 'UserId' })
  UserId: number;

  @ManyToOne(() => Users, (user) => user.ChatRecord, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @Column('int', { name: 'ChatId' })
  ChatId: number;

  @ManyToOne(() => Chats, (chat) => chat.ChatRecord, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ChatId', referencedColumnName: 'id' }])
  Chat: Chats;
}
