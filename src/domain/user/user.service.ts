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
import { Transactional } from 'typeorm-transactional';
import { AreaRepository } from './area.repository';
import { UserAreaRepository } from './user-area.repository';
import { ChatUserRepository } from './chat-user.repository';
import { reportDto } from './dto/request.report.dto';
import { ReportsRepository } from './report.repository';
import { blockDto } from './dto/request.block.dto';
import { BlocksRepository } from './block.repository';
import { Blocks } from '../entities/block';

@Injectable()
export class UserService {
  KAKAP_KEY = process.env.KAKAO_KEY;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly areaRepository: AreaRepository,
    private readonly userAreaRepository: UserAreaRepository,
    private readonly chatUserRepository: ChatUserRepository,
    private readonly reportsRepository: ReportsRepository,
    private readonly blocksRepository: BlocksRepository,
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
      const isUserEmail = await this.userRepository.findOne({
        where: { email },
      });

      // const oauth = isUserEmail.kakaoId
      //   ? '카카오'
      //   : isUserEmail.naverId
      //   ? '네이버'
      //   : isUserEmail.appleId
      //   ? '애플'
      //   : '구글';

      if (isUserEmail) {
        throw new BadRequestException(`이미 가입해 사용중인 이메일입니다.`);
      }
      const newUser = await this.userRepository.createUser(dto);
      const result = await this.createTokens(newUser.id);
      await this.userRepository.updateRefreshToken(
        result.refreshToken,
        newUser.id,
      );
      return result;
    }

    const result = await this.createTokens(isUser.id);
    await this.userRepository.updateRefreshToken(
      result.refreshToken,
      isUser.id,
    );
    return result;
  }

  async logout(user): Promise<void> {
    await this.userRepository.deleteRefreshToken(user.id);
  }

  async refresh(
    body: refreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = body;

    const isUser = await this.userRepository.findOne({
      where: { refreshToken },
    });
    if (!isUser) {
      throw new BadRequestException('로그인이 필요합니다.');
    }
    const result = await this.createTokens(isUser.id);
    await this.userRepository.updateRefreshToken(
      result.refreshToken,
      isUser.id,
    );
    return result;
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
    const result = await this.createTokens(newUser.id);
    await this.userRepository.updateRefreshToken(
      result.refreshToken,
      newUser.id,
    );
    return result;
  }

  async nicknameDuplicationCheck(nickname: string): Promise<void> {
    const isUser = await this.userRepository.findOne({ where: { nickname } });
    if (isUser) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }
    return;
  }

  async emailDuplicationCheck(email: string): Promise<void> {
    const isUser = await this.userRepository.findOne({ where: { email } });
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
    const { city, state, address, apartmentName } = body;
    const isArea = await this.areaRepository.findOne({
      where: { city, state, address, apartmentName },
    });

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
      const newArea = await this.areaRepository.createArea(
        body,
        longitude,
        latitude,
      );
      return newArea;
    }
    return isArea;
  }

  async isAddress(user): Promise<Areas> {
    const isArea = await this.areaRepository.findAreaByUserId(user.id);
    if (!isArea) {
      throw new BadRequestException('주소가 등록되어 있지 않습니다.');
    }
    return isArea;
  }

  @Transactional()
  async setAddress(body: setAddressDto, user): Promise<void> {
    const { id: userId } = user;
    const isUserArea = await this.userAreaRepository.findOne({
      where: { UserId: userId },
    });

    const isChatUser = await this.chatUserRepository.findOne({
      where: { UserId: userId },
    });

    if (isChatUser) {
      throw new BadRequestException('이미 참여중인 채팅방이 있습니다.');
    }

    if (isUserArea) {
      await this.userAreaRepository.deleteUserArea(userId);
    }

    await this.userAreaRepository.createUserArea(body, userId);
    return;
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
    const addressName = isKakaoMapData?.documents[0]?.address_name;
    const placeName = isKakaoMapData?.documents[0]?.place_name;
    const longitude = isKakaoMapData?.documents[0]?.x;
    const latitude = isKakaoMapData?.documents[0]?.y;

    return { placeName, addressName, longitude, latitude };
  }

  async editProfileImage(file, user): Promise<void> {
    const { id: userId } = user;
    const isUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!isUser) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }
    const profileImage = file.filename;
    await this.userRepository.updateProfileImage(profileImage, user.id);
    return;
  }

  async report(body: reportDto, user): Promise<void> {
    const { ReportedId } = body;
    const { id: userId } = user;

    if (userId === ReportedId) {
      throw new BadRequestException('자신을 신고할 수 없습니다.');
    }

    const isReported = await this.reportsRepository.findOne({
      where: { UserId: userId, ReportedId },
    });

    if (isReported) {
      throw new BadRequestException('이미 신고한 유저입니다.');
    }

    await this.reportsRepository.createReport(body, userId);
  }

  async block(body: blockDto, user): Promise<void> {
    const { UserId: BlockedId } = body;
    const { id: userId } = user;

    if (userId === BlockedId) {
      throw new BadRequestException('자신을 차단할 수 없습니다.');
    }

    const isBlocked = await this.blocksRepository.findOne({
      where: { UserId: userId, BlockedId: BlockedId },
    });

    if (isBlocked) {
      await this.blocksRepository.delete({
        UserId: userId,
        BlockedId: BlockedId,
      });
    } else {
      await this.blocksRepository.createBlock(BlockedId, userId);
    }
  }

  async getBlockList(user): Promise<Blocks[]> {
    const { id: userId } = user;
    const blockList = await this.blocksRepository.find({
      where: { UserId: userId },
    });
    return blockList;
  }
}
