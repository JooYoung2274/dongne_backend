import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class setAddressDto {
  @IsNumber()
  @ApiProperty({
    description: '지역 id',
    required: true,
    nullable: false,
    example: 1,
  })
  areaId: number;
}
