import { CurrentUser } from './decorators/user.decorator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { accessToken, JwtPayloadType } from 'src/utilits/types';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from './auth.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthProvider,
  ) {}

  async findAllUsers() {
    return await this.userRepo.find();
  }

  /**
   * create new user
   * @param createUserDto
   * @returns jwt token
   */
  async createNewUser(createUserDto: CreateUserDto): Promise<accessToken> {
    return this.authService.createNewUser(createUserDto);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;
    const user = await this.getUserById(id);
    user.email = updateUserDto.email ?? user.email;
    // user.hashedPassword = updateUserDto.password ?? user.hashedPassword;
    user.username = updateUserDto.username ?? user.username;
    if (password) {
      user.hashedPassword = await this.authService.hashedPassword(password);
    }
    await this.userRepo.save(user);
    return `updated succeffully!`;
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found by this id');
    // const { password, ...rest } = user;
    return user;
  }

  async deleteUser(id: number, payLoad: JwtPayloadType) {
    const user = await this.currentUser(id);
    if (user.id === payLoad.id || payLoad.userType === 'ADMIN') {
      await this.userRepo.delete(id);
      return `deleted succeffully`;
    }
    throw new UnauthorizedException();
  }

  /**
   * log in method
   * @param logInDto
   * @returns jwt(access token)
   */
  async logIn(logInDto: LogInDto): Promise<accessToken> {
    return await this.authService.logIn(logInDto);
  }

  async currentUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }
}
