import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class loginDto {
  @IsEmail()
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  @ApiProperty({
    description: 'email',
    required: true,
    nullable: false,
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: '닉네임',
    required: true,
    nullable: false,
    example: '테스트닉네임',
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: '전화번호',
    required: true,
    nullable: false,
    example: '01012345678',
  })
  phoneNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '프로필 사진',
    nullable: true,
    example: 'http://test.com/test.png',
  })
  profileImage: string;

  @IsBoolean()
  @ApiProperty({
    description: '정보 수신 동의',
    nullable: false,
    required: true,
  })
  newsNotification: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '푸시 토큰',
    required: false,
    nullable: true,
    example: null,
  })
  pushToken: string;

  @IsString()
  @ApiProperty({
    description: '역할',
    required: true,
    nullable: false,
    example: 'USER',
  })
  role: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'googleId', nullable: true, example: null })
  googleId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '비밀번호', nullable: true, example: '1234fff' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'kakaoId', nullable: true, example: null })
  kakaoId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'naverId', nullable: true, example: null })
  naverId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'appleId', nullable: true, example: null })
  appleId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'refreshToken', nullable: true, example: null })
  refreshToken: string;
}
