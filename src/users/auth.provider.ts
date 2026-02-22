import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayloadType } from 'src/utilits/types';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  /**
   * create new user
   * @param createUserDto
   * @returns jwt token
   */
  async createNewUser(createUserDto: CreateUserDto) {
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
  //   getUserByEmail(email: CreateUserDto) {
  //     throw new Error('Method not implemented.');
  //   }

  /**
   * log in method
   * @param logInDto
   * @returns jwt(access token)
   */
  async logIn(logInDto: LogInDto) {
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
  private async generateAccessToken(payLoad: JwtPayloadType) {
    const accessToken = await this.jwtService.signAsync(payLoad);
    return accessToken;
  }

  public async hashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'hashedPassword'],
    });

    // if (!user) throw new NotFoundException('no user by this email');
    return user;
  }
}
