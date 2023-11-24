import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user';
import { QueryRunner, Repository } from 'typeorm';
import { loginDto } from './dto/request.login.dto';
import { UserAreas } from '../entities/userArea';
import { checkAddressDto } from './dto/request.checkAddress.dto';
import { Areas } from '../entities/area';
import { setAddressDto } from './dto/request.setAddress.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Areas) private areaRepository: Repository<Areas>,
    @InjectRepository(UserAreas)
    private userAreaRepository: Repository<UserAreas>,
  ) {}

  async findOneByEmail(email: string): Promise<Users> {
    const result = await this.userRepository.findOne({ where: { email } });
    return result;
  }

  async findOneByNickname(nickname: string): Promise<Users> {
    const result = await this.userRepository.findOne({ where: { nickname } });
    return result;
  }

  async findOneByOauthId(kakaoId, naverId, googleId, appleId) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .where('user.kakaoId = :kakaoId', { kakaoId })
      .orWhere('user.naverId = :naverId', { naverId })
      .orWhere('user.googleId = :googleId', { googleId })
      .orWhere('user.appleId = :appleId', { appleId })
      .getOne();
    return result;
  }

  async createUser(dto: loginDto): Promise<Users> {
    const newUser = await this.userRepository.create();
    newUser.email = dto.email;
    newUser.nickname = dto.nickname;
    newUser.profileImage = dto.profileImage;
    newUser.newsNotification = dto.newsNotification;
    newUser.role = dto.role;
    newUser.phoneNo = dto.phoneNo;
    newUser.password = dto.password;
    newUser.pushToken = dto.pushToken;
    newUser.googleId = dto.googleId;
    newUser.kakaoId = dto.kakaoId;
    newUser.naverId = dto.naverId;
    newUser.appleId = dto.appleId;
    newUser.refreshToken = dto.refreshToken;

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findUserAreaByUserId(userId: number): Promise<UserAreas> {
    const result = await this.userAreaRepository.findOne({
      where: { UserId: userId },
    });
    return result;
  }

  async findOneById(id: number) {
    const result = await this.userRepository.findOne({ where: { id } });
    return result;
  }

  async findArea(body: checkAddressDto): Promise<Areas> {
    const { city, state, address, apartmentName } = body;
    const result = await this.areaRepository.findOne({
      where: { city, state, address, apartmentName },
    });
    return result;
  }

  async createArea(
    body: checkAddressDto,
    longitude: string,
    latitude: string,
  ): Promise<Areas> {
    const { city, state, address, apartmentName } = body;
    const newArea = this.areaRepository.create();
    newArea.city = city;
    newArea.state = state;
    newArea.address = address;
    newArea.apartmentName = apartmentName;
    newArea.longitude = longitude;
    newArea.latitude = latitude;
    await this.areaRepository.save(newArea);
    return newArea;
  }

  async createUserArea(
    body: setAddressDto,
    userId: number,
    queryRunner?: QueryRunner,
  ): Promise<UserAreas> {
    const { areaId } = body;
    const newUserArea = queryRunner.manager.create(UserAreas);
    newUserArea.AreaId = areaId;
    newUserArea.UserId = userId;
    await queryRunner.manager.save(newUserArea);
    return newUserArea;
  }

  async findAreaByUserId(userId: number): Promise<Areas> {
    const result = await this.areaRepository
      .createQueryBuilder('area')
      .leftJoin('area.UserArea', 'userArea')
      .leftJoin('userArea.User', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
    return result;
  }

  async deleteUserArea(userId: number, queryRunner?: QueryRunner) {
    await queryRunner.manager.delete(UserAreas, { UserId: userId });
  }
}
