import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let newUser = this.userRepo.create({
      email,
      username,
      hashedPssword: hashedPass,
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
    const user = await this.getUserById(id);
    user.email = updateUserDto.email ?? user.email;
    user.hashedPssword = updateUserDto.password ?? user.hashedPssword;
    user.username = updateUserDto.username ?? user.username;
    return await this.userRepo.save(user);
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found by this id');
    // const { password, ...rest } = user;
    return user;
  }

  async deleteUser(id: number) {
    const user = this.getUserById(id);
    return await this.userRepo.delete(id);
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
    const pass = await bcrypt.compare(password, user.hashedPssword);
    // console.log(pass);
    if (!pass) throw new BadRequestException('bad credentials');

    const payLoad: JwtPayloadType = { id: user.id, userType: user.userType };
    const accessToken = await this.generateAccessToken(payLoad);

    return { accessToken };
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email } });
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
}
