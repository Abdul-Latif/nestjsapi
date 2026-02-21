import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadType } from 'src/utilits/types';
import { ConfigService } from '@nestjs/config';
import { UserType } from 'src/utilits/user-type.enum';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length == 0) return false;

    const request: Request = await context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (token && type === 'Bearer') {
      try {
        const paylod: JwtPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.config.get<string>('JWT_SECRET'),
          },
        );

        const user = await this.userService.getUserById(paylod.id);
        if (!user) return false;

        if (roles.includes(user.userType)) {
          request['user'] = paylod;
          return true;
        }
      } catch (error) {
        throw new UnauthorizedException(
          "access denied, you don't have permission",
        );
      }
    } else {
      //   return false;
      throw new UnauthorizedException("you didn't priovide the token");
    }

    return false;
  }
}
