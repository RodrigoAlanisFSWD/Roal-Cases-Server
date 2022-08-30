import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";

@Injectable()
export class MailGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        console.log(req.user)

        if (!req.user) {
            throw new UnauthorizedException()
        }

        if (!req.user.mail_confirmed) {
            throw new UnauthorizedException()
        }

        return super.canActivate(context)
    }
}