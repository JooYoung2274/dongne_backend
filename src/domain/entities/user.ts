import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAreas } from './userArea';
import { ChatUsers } from './chatUser';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nickname' })
  nickname: string;

  @Column('varchar', { name: 'image' })
  image: string;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'address' })
  address: string;

  @Column('varchar', { name: 'profileImage' })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserAreas, (userArea) => userArea.User)
  UserArea: UserAreas[];

  @OneToMany(() => ChatUsers, (chatUser) => chatUser.User)
  ChatUser: ChatUsers[];
}
