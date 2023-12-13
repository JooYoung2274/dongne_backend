import { Injectable } from '@nestjs/common';
import { Users } from '../entities/user';
import { DataSource, Repository } from 'typeorm';
import { loginDto } from './dto/request.login.dto';

@Injectable()
export class UserRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async findOneByEmail(email: string): Promise<Users> {
    const result = await this.findOne({ where: { email } });
    return result;
  }

  async findOneByNickname(nickname: string): Promise<Users> {
    const result = await this.findOne({ where: { nickname } });
    return result;
  }

  async findOneByOauthId(kakaoId, naverId, googleId, appleId) {
    const result = await this.createQueryBuilder('user')
      .where('user.kakaoId = :kakaoId', { kakaoId })
      .orWhere('user.naverId = :naverId', { naverId })
      .orWhere('user.googleId = :googleId', { googleId })
      .orWhere('user.appleId = :appleId', { appleId })
      .getOne();
    return result;
  }

  async createUser(dto: loginDto): Promise<Users> {
    const newUser = await this.create();
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

    await this.save(newUser);
    return newUser;
  }

  async findOneById(id: number) {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async deleteRefreshToken(id: number) {
    await this.update(id, { refreshToken: null });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<Users> {
    const result = await this.findOne({
      where: { refreshToken },
    });
    return result;
  }

  async updateProfileImage(profileImage, id) {
    const isUser = await this.findOne({ where: { id } });
    isUser.profileImage = 'dist/uploads' + profileImage;
    await this.save(isUser);
  }

  async updateRefreshToken(refreshToken: string, userid: number) {
    const isUser = await this.findOne({ where: { id: userid } });
    isUser.refreshToken = refreshToken;
    await this.save(isUser);
  }
}
