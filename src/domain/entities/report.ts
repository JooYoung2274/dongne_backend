import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user';
import { Areas } from './area';

@Entity('reports')
export class Reports {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { name: 'UserId' })
  UserId: number;

  @ManyToOne(() => Users, (user) => user.Reports, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;
}
