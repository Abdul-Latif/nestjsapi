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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInDto } from './dto/log-in.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-users')
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('create-new-user')
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createNewUser(createUserDto);
  }

  @Patch('update-user/:id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Get(':id')
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
}
