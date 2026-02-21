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
import * as bcrypt from 'bcryptjs';
import { LogInDto } from './dto/log-in.dto';
import { accessToken, JwtPayloadType } from 'src/utilits/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
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
    const { email, username, password } = createUserDto;
    const user = await this.getUserByEmail(email);
    if (user) throw new BadRequestException('user already exist');

    const hashedPass = await this.hashedPassword(createUserDto.password);

    let newUser = this.userRepo.create({
      email,
      username,
      hashedPassword: hashedPass,
    });

    newUser = await this.userRepo.save(newUser);
    const payLoad: JwtPayloadType = {
      id: newUser.id,
      userType: newUser.userType,
    };
    const accessToken = await this.generateAccessToken(payLoad);
    return { accessToken };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;
    const user = await this.getUserById(id);
    user.email = updateUserDto.email ?? user.email;
    // user.hashedPassword = updateUserDto.password ?? user.hashedPassword;
    user.username = updateUserDto.username ?? user.username;
    if (password) {
      user.hashedPassword = await this.hashedPassword(password);
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
    // console.log(logInDto.email);
    const { email, password } = logInDto;
    const user = await this.getUserByEmail(email);
    // console.log(user);
    if (!user) throw new NotFoundException('there is no usre by this email');
    const pass = await bcrypt.compare(password, user.hashedPassword);
    // console.log(pass);
    if (!pass) throw new BadRequestException('bad credentials');

    const payLoad: JwtPayloadType = { id: user.id, userType: user.userType };
    const accessToken = await this.generateAccessToken(payLoad);

    return { accessToken };
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'hashedPassword'],
    });

    // if (!user) throw new NotFoundException('no user by this email');
    return user;
  }

  private async generateAccessToken(payLoad: JwtPayloadType) {
    const accessToken = await this.jwtService.signAsync(payLoad);
    return accessToken;
  }

  async currentUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  private async hashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
