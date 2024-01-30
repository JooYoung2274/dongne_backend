import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Friends } from '../entities/friend';

@Injectable()
export class FriendRepository extends Repository<Friends> {
  constructor(private dataSource: DataSource) {
    super(Friends, dataSource.createEntityManager());
  }
}
