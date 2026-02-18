import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadType } from 'src/utilits/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
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

        request['user'] = paylod;
        // request['user'] =
        // console.log(paylod);
        if (paylod.userType === 'admin') {
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

    // throw new UnauthorizedException('only admins can use this');
    return false;
  }
}
