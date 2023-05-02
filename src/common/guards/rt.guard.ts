import {AuthGuard} from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor(props) {
    super(props);
  }
}
