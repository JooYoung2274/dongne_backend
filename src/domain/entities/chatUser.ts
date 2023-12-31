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

@Entity('chatUsers')
export class ChatUsers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('boolean', { name: 'isHost', nullable: true })
  isHost: boolean;

  @Column('boolean', { name: 'isPaid', nullable: true })
  isPaid: boolean;

  @Column('int', { name: 'amount', nullable: true })
  amount: number;

  @Column('date', { name: 'paidAt', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { name: 'UserId' })
  UserId: number;

  @ManyToOne(() => Users, (user) => user.ChatUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @Column('int', { name: 'ChatId' })
  ChatId: number;

  @ManyToOne(() => Chats, (chat) => chat.ChatUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ChatId', referencedColumnName: 'id' }])
  Chat: Chats;
}
