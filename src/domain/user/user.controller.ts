import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto } from './dto/request.login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입/로그인' })
  // @ApiBearerAuth('access-token')
  @Post('signup')
  async signup(@Body() body: loginDto) {
    return this.userService.signup(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() body: loginDto) {
    return this.userService.login(body);
  }
}
