import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './passport/jwt.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { AxiosClass } from 'src/util/axios.class';
import { AreaRepository } from './area.repository';
import { UserAreaRepository } from './user-area.repository';
import { ChatUserRepository } from './chat-user.repository';
import { ReportsRepository } from './report.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    UserService,
    UserRepository,
    AreaRepository,
    UserAreaRepository,
    ChatUserRepository,
    GoogleStrategy,
    JwtStrategy,
    AxiosClass,
  ],
  controllers: [UserController],
  exports: [
    UserRepository,
    AreaRepository,
    UserAreaRepository,
    ChatUserRepository,
    ReportsRepository,
  ],
})
export class UserModule {}
