import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { loginDto } from './dto/request.login.dto';
import * as bcrypt from 'bcrypt';
import { checkAddressDto } from './dto/request.checkAddress.dto';
import { Areas } from '../entities/area';
import { AxiosClass } from 'src/util/axios.class';
import { AddressResponse } from 'src/util/kakaoMap.type';
import { setAddressDto } from './dto/request.setAddress.dto';
import { DataSource } from 'typeorm';
import { refreshTokenDto } from './dto/request.refresh.dto';

@Injectable()
export class UserService {
  KAKAP_KEY = process.env.KAKAO_KEY;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly axiosClass: AxiosClass,
    private dataSource: DataSource,
  ) {}

  async login(
    dto: loginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { kakaoId, naverId, appleId, googleId, email, password } = dto;
    const isUser = await this.userRepository.findOneByOauthId(
      kakaoId,
      naverId,
      googleId,
      appleId,
    );

    if (!kakaoId && !naverId && !appleId && !googleId) {
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
      const isUserEmail = await this.userRepository.findOneByEmail(email);

      const oauth = isUserEmail.kakaoId
        ? '카카오'
        : isUserEmail.naverId
        ? '네이버'
        : isUserEmail.appleId
        ? '애플'
        : '구글';

      if (isUserEmail) {
        throw new BadRequestException(
          `이미 ${oauth}로 가입해 사용중인 이메일입니다.`,
        );
      }
      const newUser = await this.userRepository.createUser(dto);
      return await this.createTokens(newUser.id);
    }

    return await this.createTokens(isUser.id);
  }

  async logout(user): Promise<void> {
    await this.userRepository.deleteRefreshToken(user.id);
  }

  async refresh(
    body: refreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = body;
    const isUser =
      await this.userRepository.findOneByRefreshToken(refreshToken);
    if (!isUser) {
      throw new BadRequestException('로그인이 필요합니다.');
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
    const payload = { id: id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '28d',
    });
    return { accessToken, refreshToken };
  }

  async checkAddress(body: checkAddressDto): Promise<Areas> {
    const isArea = await this.userRepository.findArea(body);

    if (!isArea) {
      //위도 경도 찾고
      const isKakaoMapData = await this.axiosClass.get<AddressResponse>(
        'https://dapi.kakao.com/v2/local/search/address.json',
        { query: body.address },
        `KakaoAK ${this.KAKAP_KEY}`,
      );

      if (!isKakaoMapData.documents.length) {
        throw new BadRequestException('주소를 찾을 수 없습니다.');
      }

      const longitude = isKakaoMapData?.documents[0]?.road_address?.x;
      const latitude = isKakaoMapData?.documents[0]?.road_address?.y;

      //신규 지역 등록
      const newArea = await this.userRepository.createArea(
        body,
        longitude,
        latitude,
      );
      return newArea;
    }
    return isArea;
  }

  async isAddress(user): Promise<Areas> {
    const isArea = await this.userRepository.findAreaByUserId(user.id);
    if (!isArea) {
      throw new BadRequestException('주소가 등록되어 있지 않습니다.');
    }
    return isArea;
  }

  async setAddress(body: setAddressDto, user): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isUserArea = await this.userRepository.findUserAreaByUserId(user.id);

    try {
      if (isUserArea) {
        await this.userRepository.deleteUserArea(user.id, queryRunner);
      }
      await this.userRepository.createUserArea(body, user.id, queryRunner);

      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      throw new BadRequestException('주소 설정에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async getMarketAddress(address: string): Promise<{
    placeName: string;
    addressName: string;
    longitude: string;
    latitude: string;
  }> {
    const isKakaoMapData = await this.axiosClass.get<AddressResponse>(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
      { query: address },
      `KakaoAK ${this.KAKAP_KEY}`,
    );

    if (!isKakaoMapData.documents.length) {
      throw new BadRequestException('주소를 찾을 수 없습니다.');
    }
    console.log(isKakaoMapData.documents[0]);
    const addressName = isKakaoMapData?.documents[0]?.address_name;
    const placeName = isKakaoMapData?.documents[0]?.place_name;
    const longitude = isKakaoMapData?.documents[0]?.x;
    const latitude = isKakaoMapData?.documents[0]?.y;

    return { placeName, addressName, longitude, latitude };
  }
}
