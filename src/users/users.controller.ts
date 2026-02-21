import { ReviewsService } from './../reviews/reviews.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/user.decorator';
import { JwtPayloadType } from 'src/utilits/types';
import { Roles } from './decorators/role.decorator';
import { UserType } from 'src/utilits/user-type.enum';
import { AuthRoleGuard } from './guards/auth-role.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-users')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('create-new-user')
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createNewUser(createUserDto);
  }

  @Patch('update-user/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Get('user/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() logInDto: LogInDto) {
    return await this.usersService.logIn(logInDto);
  }

  @Get('get-current-user')
  // @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN)
  // @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  async currentUser(@CurrentUser() payLoad: JwtPayloadType) {
    return this.usersService.currentUser(payLoad.id);
  }
}
