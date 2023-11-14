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

  @Column('varchar', { name: 'password', nullable: true })
  password: string;

  @Column('varchar', { name: 'phoneNo' })
  phoneNo: string;

  @Column('boolean', { name: 'newsNotification' })
  newsNotification: boolean;

  @Column('varchar', { name: 'pushToken', nullable: true })
  pushToken: string;

  @Column('varchar', { name: 'idToken', nullable: true })
  idToken: string;

  @Column('varchar', { name: 'kakaoId', nullable: true })
  kakaoId: string;

  @Column('varchar', { name: 'naverId', nullable: true })
  naverId: string;

  @Column('varchar', { name: 'appleId', nullable: true })
  appleId: string;

  @Column('varchar', { name: 'refreshToken', nullable: true })
  refreshToken: string;

  @Column('varchar', { name: 'role' })
  role: string;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'address', nullable: true })
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