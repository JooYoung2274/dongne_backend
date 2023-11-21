import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class checkAddressDto {
  @IsString()
  @ApiProperty({
    description: '아파트이름',
    required: true,
    nullable: false,
    example: '어쩌꾸아파트',
  })
  apartmentName: string;

  @IsString()
  @ApiProperty({
    description: '전체주소',
    required: true,
    nullable: false,
    example: '남양주시 진접읍',
  })
  address: string;

  @IsString()
  @ApiProperty({
    description: '시/도',
    required: true,
    nullable: false,
    example: '남양주시',
  })
  city: string;

  @IsString()
  @ApiProperty({
    description: '동/면/읍',
    required: true,
    nullable: false,
    example: '진접읍',
  })
  state: string;
}
