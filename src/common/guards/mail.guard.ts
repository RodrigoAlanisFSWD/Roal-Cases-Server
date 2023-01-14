import {
  ExecutionContext,
  ForbiddenException,
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
      throw new UnauthorizedException();
    }

    if (!req.user.mail_confirmed) {
      throw new ForbiddenException();
    }

    return super.canActivate(context);
  }
}
