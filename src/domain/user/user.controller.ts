import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto } from './dto/request.login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { checkAddressDto } from './dto/request.checkAddress.dto';
import { Areas } from '../entities/area';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/user.decorator';
import { setAddressDto } from './dto/request.setAddress.dto';
import { refreshTokenDto } from './dto/request.refresh.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { reportDto } from './dto/request.report.dto';
import { blockDto } from './dto/request.block.dto';

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
  async login(
    @Body() body: loginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.userService.login(body);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@User() user): Promise<void> {
    console.log(user);
    // return this.userService.logout(user);
    return;
  }

  @ApiOperation({ summary: '리프레시 토큰' })
  @Post('refresh')
  async refresh(
    @Body() body: refreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.userService.refresh(body);
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

  @ApiOperation({ summary: '프로필 사진 업로드' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'dist/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `/${randomName}.png`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: any,
  ) {
    await this.userService.editProfileImage(file, user);
  }

  @ApiOperation({ summary: '신고하기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('report')
  async report(@Body() body: reportDto, @User() user): Promise<void> {
    await this.userService.report(body, user);
  }

  @ApiOperation({ summary: '차단하기 / 차단 해제하기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('block')
  async block(@Body() body: blockDto, @User() user): Promise<void> {
    await this.userService.block(body, user);
  }

  @ApiOperation({ summary: '내 차단 목록 불러오기' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('getBlockList')
  async getBlockList(@User() user): Promise<any> {
    return await this.userService.getBlockList(user);
  }
}
