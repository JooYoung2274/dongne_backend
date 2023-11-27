import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class refreshTokenDto {
  @IsString()
  @ApiProperty({
    description: '리프레시토큰',
    required: false,
    nullable: true,
    example: 'dfsadgasedflkanweltnalk3wntrlkaw3ntlksenflkd',
  })
  refreshToken: 'dsfsdfsdgdsfsdfsdfsdf';
}
