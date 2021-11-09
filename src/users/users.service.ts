import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
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
    const { password, ...user } = await this.userRepository.save(createUserDto);
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

  update(email: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(email, updateUserDto);
  }

  remove(email: string) {
    return this.userRepository.delete({ email });
  }
}
