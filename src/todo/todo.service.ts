import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  async create(createTodoDto: CreateTodoDto, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(
        `The user with email ${email} does not exist`,
      );
    }
    const todo = { ...createTodoDto, user };
    return this.todoRepository.save(todo);
  }

  async findAllForUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(
        `The user with email ${email} does not exist`,
      );
    }
    return this.todoRepository.find({
      where: {
        user,
      },
    });
  }

  async findOne(id: number, user) {
    const todo = await this.todoRepository.findOne({
      where: {
        user,
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException(
        `The todo with id ${id} does not exist for user ${user.email}`,
      );
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    const todo = await this.findOne(id, user);
    const result = await this.todoRepository.update(id, updateTodoDto);
    if (result.affected) {
      return { ...todo, ...updateTodoDto };
    }
    throw new BadRequestException('Update failed');
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
  }
}
