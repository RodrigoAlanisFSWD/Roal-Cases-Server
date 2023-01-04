import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (req.user.role != 'ADMIN') {
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }
}
