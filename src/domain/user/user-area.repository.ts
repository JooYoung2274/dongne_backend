import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserAreas } from '../entities/userArea';
import { setAddressDto } from './dto/request.setAddress.dto';

@Injectable()
export class UserAreaRepository extends Repository<UserAreas> {
  constructor(private dataSource: DataSource) {
    super(UserAreas, dataSource.createEntityManager());
  }

  // async findUserAreaByUserId(userId: number): Promise<UserAreas> {
  //   const result = await this.findOne({
  //     where: { UserId: userId },
  //   });
  //   return result;
  // }

  async createUserArea(
    body: setAddressDto,
    userId: number,
  ): Promise<UserAreas> {
    const { areaId } = body;
    const newUserArea = this.create();
    newUserArea.AreaId = areaId;
    newUserArea.UserId = userId;
    await this.save(newUserArea);
    return newUserArea;
  }

  async deleteUserArea(userId: number) {
    return await this.delete({ UserId: userId });
  }
}
