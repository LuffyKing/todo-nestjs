import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Users } from 'src/users/entities/user.entity';
import { CaslModule } from 'src/casl/casl.module';
// import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [TypeOrmModule.forFeature([Todo, Users]), CaslModule],
})
export class TodoModule {}
