import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class createChatRoomDto {
  @IsString()
  @ApiProperty({
    description: '채팅방이름',
    required: true,
    nullable: false,
    example: '진접읍 비비큐 드실분',
  })
  title: string;

  @IsNumber()
  @ApiProperty({
    description: '최대인원',
    required: true,
    nullable: false,
    example: 4,
  })
  max: number;

  @IsNumber()
  @ApiProperty({
    description: '카테고리 ID',
    required: true,
    nullable: false,
    example: 1,
  })
  CategoryId: number;

  @IsNumber()
  @ApiProperty({
    description: '배달비',
    required: true,
    nullable: false,
    example: 5000,
  })
  deliveryFee: number;

  @IsNumber()
  @ApiProperty({
    description: '지역Id',
    required: true,
    nullable: false,
    example: 1,
  })
  AreaId: number;

  @IsString()
  @ApiProperty({
    description: '함께주문 링크',
    required: true,
    nullable: false,
    example: 'https://함께주문링크입니다',
  })
  orderLink: string;

  @IsString()
  @ApiProperty({
    description: '상호명',
    required: true,
    nullable: false,
    example: '비비큐 진접점',
  })
  restaurantName: string;

  @IsString()
  @ApiProperty({
    description: '마감시간',
    required: true,
    nullable: false,
    example: new Date(),
  })
  dueDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '위도',
    required: false,
    nullable: true,
    example: '37.123456',
  })
  latitude: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '경도',
    required: false,
    nullable: true,
    example: '127.123456',
  })
  longitude: string;
}
