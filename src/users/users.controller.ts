import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailParamValidatiion } from 'src/validators/validator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto, 1);
    return user;
  }

  @Get(':email')
  findOne(@Param() params: EmailParamValidatiion) {
    return this.usersService.findOne(params.email);
  }

  @Patch(':email')
  update(
    @Param() params: EmailParamValidatiion,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(params.email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param() params: EmailParamValidatiion) {
    return this.usersService.remove(params.email);
  }
}
