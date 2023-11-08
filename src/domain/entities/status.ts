import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chats } from './chat';

@Entity('statuses')
export class Statuses {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'status' })
  status: string;

  @OneToMany(() => Chats, (chat) => chat.Status)
  Chat: Chats[];
}
