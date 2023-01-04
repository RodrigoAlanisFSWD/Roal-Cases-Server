import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user/user.entity';
import {UserService} from './user/user.service';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule} from '@nestjs/config';
import {AtStrategy, RtStrategy} from './strategies';
import {MailModule} from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, UserService],
  exports: [UserService, AuthService],
})
export class AuthModule {}
