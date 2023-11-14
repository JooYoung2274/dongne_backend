import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user';
import { Repository } from 'typeorm';
import { loginDto } from './dto/request.login.dto';
import { UserAreas } from '../entities/userArea';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
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
    newUser.idToken = dto.idToken;
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
}
