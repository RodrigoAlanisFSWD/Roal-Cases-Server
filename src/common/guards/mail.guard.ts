import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';

@Injectable()
export class MailGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new HttpException('Unaunthorized', 401)
    }

    if (!req.user.mail_confirmed) {
      throw new HttpException('Email Not Confirmed', 403);
    }

    return super.canActivate(context);
  }
}
