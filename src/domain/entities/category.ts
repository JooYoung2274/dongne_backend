import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chats } from './chat';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', { name: 'image' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Chats, (chat) => chat.Category)
  Chat: Chats[];
}
