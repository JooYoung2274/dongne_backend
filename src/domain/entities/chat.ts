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
import { Areas } from './area';
import { ChatRecords } from './chatRecord';

@Entity('chats')
export class Chats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title' })
  title: string;

  @Column('varchar', { name: 'orderLink' })
  orderLink: string;

  @Column('varchar', { name: 'longitude' })
  longitude: string;

  @Column('varchar', { name: 'latitude' })
  latitude: string;

  @Column('varchar', { name: 'restaurantName' })
  restaurantName: string;

  @Column('varchar', { name: 'categoryProfile' })
  categoryProfile: string;

  @Column('int', { name: 'max' })
  max: number;

  @Column('int', { name: 'deliveryFee', nullable: true })
  deliveryFee: number;

  @Column('boolean', { name: 'isAllPaid', nullable: true })
  isAllPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  dueDate: Date;

  @Column('int', { name: 'StatusId' })
  StatusId: number;

  @ManyToOne(() => Statuses, (status) => status.Chat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'StatusId', referencedColumnName: 'id' }])
  Status: Statuses;

  @Column('int', { name: 'AreaId' })
  AreaId: number;

  @ManyToOne(() => Areas, (area) => area.Chat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'AreaId', referencedColumnName: 'id' }])
  Area: Areas;

  @OneToMany(() => ChatUsers, (chatUser) => chatUser.Chat)
  ChatUser: ChatUsers[];

  @OneToMany(() => ChatRecords, (chatRecord) => chatRecord.Chat)
  ChatRecord: ChatRecords[];
}
