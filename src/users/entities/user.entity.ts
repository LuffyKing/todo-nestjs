import { Todo } from 'src/todo/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', length: '100', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '100' })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
