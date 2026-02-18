import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utilits/user-type.enum';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
