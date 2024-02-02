import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Areas } from '../entities/area';
import { checkAddressDto } from './dto/request.checkAddress.dto';

@Injectable()
export class AreaRepository extends Repository<Areas> {
  constructor(private dataSource: DataSource) {
    super(Areas, dataSource.createEntityManager());
  }

  // async findArea(body: checkAddressDto): Promise<Areas> {
  //   const { city, state, address, apartmentName } = body;
  //   const result = await this.findOne({
  //     where: { city, state, address, apartmentName },
  //   });
  //   return result;
  // }

  async createArea(
    body: checkAddressDto,
    longitude: string,
    latitude: string,
  ): Promise<Areas> {
    const { city, state, address, apartmentName } = body;
    const newArea = this.create();
    newArea.city = city;
    newArea.state = state;
    newArea.address = address;
    newArea.apartmentName = apartmentName;
    newArea.longitude = longitude;
    newArea.latitude = latitude;
    await this.save(newArea);
    return newArea;
  }

  async findAreaByUserId(userId: number): Promise<Areas> {
    const result = await this.createQueryBuilder('area')
      .leftJoin('area.UserArea', 'userArea')
      .leftJoin('userArea.User', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
    return result;
  }
}
