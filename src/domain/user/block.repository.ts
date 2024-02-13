import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Blocks } from '../entities/block';

@Injectable()
export class BlocksRepository extends Repository<Blocks> {
  constructor(private dataSource: DataSource) {
    super(Blocks, dataSource.createEntityManager());
  }

  async createBlock(blockUserId: number, userId: number): Promise<void> {
    const newBlock = this.create();
    newBlock.UserId = userId;
    newBlock.BlockedId = blockUserId;
    await this.save(newBlock);
  }
}
