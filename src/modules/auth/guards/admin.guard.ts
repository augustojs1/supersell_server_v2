import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';
import type { CurrentUser } from '../types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const user: CurrentUser = request['user'];

      if (!user) {
        throw new UnauthorizedException();
      }

      const currentUser = await this.usersService.findById(user.sub);

      if (!currentUser) {
        throw new UnauthorizedException();
      }

      if (!currentUser.is_admin) {
        throw new UnauthorizedException();
      }

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
