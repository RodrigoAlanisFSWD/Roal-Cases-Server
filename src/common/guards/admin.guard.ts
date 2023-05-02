import {
  ExecutionContext,
  HttpException,
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
      throw new HttpException('Unaunthorized', 401);
    }

    if (req.user.role != 'ADMIN') {
      throw new HttpException('Unaunthorized', 401);
    }

    return super.canActivate(context);
  }
}
