import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Categories } from '../entities/category';

@Injectable()
export class CategoryRepository extends Repository<Categories> {
  constructor(private dataSource: DataSource) {
    super(Categories, dataSource.createEntityManager());
  }
}
