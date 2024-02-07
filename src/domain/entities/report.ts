import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user';

@Entity('reports')
export class Reports {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'reason' })
  reason: string;

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

  @Column('int', { name: 'ReportedId' })
  ReportedId: number;

  @ManyToOne(() => Users, (user) => user.Reports, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  Reported: Users;
}
