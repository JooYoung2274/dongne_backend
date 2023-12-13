import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { Users } from '../entities/user';
import { JwtStrategy } from './passport/jwt.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { AxiosClass } from 'src/util/axios.class';
import { AreaRepository } from './area.repository';
import { UserAreaRepository } from './user-area.repository';
import { ChatUserRepository } from './chat-user.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Users]),
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
  ],
})
export class UserModule {}
