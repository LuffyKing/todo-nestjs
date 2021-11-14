import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto, permission_level) {
    const exisitngUser = await this.findOne(createUserDto.email);
    if (exisitngUser) {
      throw new BadRequestException(
        `The user with email ${createUserDto.email} already exists`,
      );
    }
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      SALT_OR_ROUNDS,
    );
    const { password, ...user } = await this.userRepository.save({
      ...createUserDto,
      permission_level,
    });
    return user;
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(email);
    if (!existingUser) {
      throw new NotFoundException(
        `The user with email ${email} does not exist`,
      );
    }
    const updatedUserDetails = {
      ...existingUser,
      ...updateUserDto,
    };
    const { password, ...user } = await this.userRepository.save(
      updatedUserDetails,
    );
    return user;
  }

  async remove(email: string) {
    const existingUser = await this.findOne(email);
    if (!existingUser) {
      throw new NotFoundException(
        `The user with email ${email} does not exist`,
      );
    }
    return this.userRepository.remove(existingUser);
  }
}
