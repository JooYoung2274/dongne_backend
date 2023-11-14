import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CreateDateColumn } from 'typeorm';

export class loginDto {
  @IsEmail()
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  @ApiProperty({ description: 'email', required: true, nullable: false })
  email: string;

  @IsString()
  @ApiProperty({ description: '닉네임', required: true, nullable: false })
  nickname: string;

  @IsString()
  @ApiProperty({ description: '전화번호', required: true, nullable: false })
  phoneNo: string;

  @CreateDateColumn()
  @ApiProperty({ description: '가입일' })
  createdAt: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '프로필 사진', nullable: true })
  profileImage: string;

  @IsBoolean()
  @ApiProperty({ description: '정보 수신 동의', nullable: false })
  newsNotification: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '푸시 토큰', required: false, nullable: true })
  pushToken: string;

  @IsString()
  @ApiProperty({ description: '역할', required: true, nullable: false })
  role: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '소셜로그인에서 받아온 oauth id token',
    nullable: true,
  })
  idToken: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '비밀번호', nullable: true })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'kakaoId', nullable: true })
  kakaoId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'naverId', nullable: true })
  naverId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'appleId', nullable: true })
  appleId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'refreshToken', nullable: true })
  refreshToken: string;
}
