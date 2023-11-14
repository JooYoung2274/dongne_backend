import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { Users } from '../entities/user';
import { JwtStrategy } from './passport/jwt.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { UserAreas } from '../entities/userArea';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Users, UserAreas]),
  ],
  providers: [UserService, UserRepository, GoogleStrategy, JwtStrategy],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
