import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ChatUsers } from './chatUser';
import { Statuses } from './status';

@Entity('chats')
export class Chats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title' })
  title: string;

  @Column('varchar', { name: 'orderLink' })
  orderLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  dueDate: Date;

  @Column('boolean', { name: 'isPrivate' })
  isPrivate: boolean;

  @Column('int', { name: 'StatusId' })
  StatusId: number;

  @ManyToOne(() => Statuses, (status) => status.Chat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'StatusId', referencedColumnName: 'id' }])
  Status: Statuses;

  @OneToMany(() => ChatUsers, (chatUser) => chatUser.Chat)
  ChatUser: ChatUsers[];
}
