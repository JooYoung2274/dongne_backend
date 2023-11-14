import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAreas } from './userArea';
import { Chats } from './chat';

@Entity('areas')
export class Areas {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'city' })
  city: string;

  @Column('varchar', { name: 'state' })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserAreas, (userArea) => userArea.Area)
  UserArea: UserAreas[];

  @OneToMany(() => Chats, (chat) => chat.Area)
  Chat: Chats[];
}
