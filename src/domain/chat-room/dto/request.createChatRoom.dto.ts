import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class createChatRoomDto {
  @IsString()
  @ApiProperty({ description: '채팅방이름', required: true, nullable: false })
  title: string;

  @IsString()
  @ApiProperty({ description: '메뉴카테고리', required: true, nullable: false })
  category: string;

  @IsNumber()
  @ApiProperty({ description: '최대인원', required: true, nullable: false })
  max: number;

  @IsNumber()
  @ApiProperty({ description: '지역Id', required: true, nullable: false })
  AreaId: number;

  @IsString()
  @ApiProperty({
    description: '함께주문 링크',
    required: true,
    nullable: false,
  })
  orderLink: string;

  @IsString()
  @ApiProperty({ description: '상호명', required: true, nullable: false })
  restaurantName: string;

  @IsString()
  @ApiProperty({ description: '마감시간', required: true, nullable: false })
  dueDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '위도', required: false, nullable: true })
  latitude: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경도', required: false, nullable: true })
  longitude: string;
}
