import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { loginDto } from './dto/request.login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    dto: loginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { kakaoId, naverId, appleId, email, password } = dto;

    const isUser = await this.userRepository.findOneByEmail(email);
    if (!kakaoId && !naverId && !appleId) {
      if (!isUser) {
        throw new BadRequestException('가입 해주세요');
      }

      const isOk = await bcrypt.compare(password, isUser.password);
      if (!isOk) {
        throw new BadRequestException('비밀번호가 틀렸습니다.');
      }

      return await this.createTokens(isUser.id);
    }

    if (!isUser) {
      const newUser = await this.userRepository.createUser(dto);
      return await this.createTokens(newUser.id);
    }

    return await this.createTokens(isUser.id);
  }

  async signup(dto: loginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, nickname, password } = dto;

    await this.emailDuplicationCheck(email);
    await this.nicknameDuplicationCheck(nickname);

    dto.password = await bcrypt.hash(password, 12);

    const newUser = await this.userRepository.createUser(dto);
    return await this.createTokens(newUser.id);
  }

  async nicknameDuplicationCheck(nickname: string): Promise<void> {
    const isUser = await this.userRepository.findOneByNickname(nickname);
    if (isUser) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }
    return;
  }

  async emailDuplicationCheck(email: string): Promise<void> {
    const isUser = await this.userRepository.findOneByEmail(email);
    if (isUser) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }
    return;
  }

  async createTokens(
    id: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '28d',
    });
    return { accessToken, refreshToken };
  }
}
