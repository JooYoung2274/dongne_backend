import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto } from './dto/request.login.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { checkAddressDto } from './dto/request.checkAddress.dto';
import { Areas } from '../entities/area';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/user.decorator';
import { setAddressDto } from './dto/request.setAddress.dto';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '(안쓰는 api)_일반 회원가입' })
  @ApiBody({ type: loginDto })
  @Post('signup')
  async signup(@Body() body: loginDto) {
    return this.userService.signup(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() body: loginDto) {
    return this.userService.login(body);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  async logout(@User() user): Promise<void> {
    return this.userService.logout(user);
  }

  @ApiOperation({ summary: '내 지역 불러오기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('isAddress')
  async isAddress(@User() user): Promise<Areas> {
    return await this.userService.isAddress(user);
  }

  @ApiOperation({
    summary:
      '전체 주소에 해당하는 지역정보(아파트이름포함) 불러오기 (db에 없으면 만들어서 리턴)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('checkAddress')
  async checkAddress(@Body() body: checkAddressDto): Promise<Areas> {
    return await this.userService.checkAddress(body);
  }

  @ApiOperation({ summary: '주소 업데이트' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('setAddress')
  async setAddress(@Body() body: setAddressDto, @User() user) {
    return await this.userService.setAddress(body, user);
  }

  @ApiOperation({ summary: '가게 위치(위도/경도) 가져오기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('getMarketAddress/:address')
  async getMarketAddress(@Param('address') address: string): Promise<{
    placeName: string;
    addressName: string;
    longitude: string;
    latitude: string;
  }> {
    return await this.userService.getMarketAddress(address);
  }
}
