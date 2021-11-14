import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Action } from 'src/constants';
import { Todo } from 'src/todo/entities/todo.entity';
import { Users } from 'src/users/entities/user.entity';

type Subjects = InferSubjects<typeof Users | typeof Todo> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Users) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);
    switch (user.permission_level) {
      case 0:
        can(Action.Manage, 'all');
        break;
      case 1:
        can(Action.Create, Todo);
        can(Action.Delete, Todo, { user });
        can(Action.Update, Todo, { user });
        can(Action.Read, Todo, { user });
        break;
      default:
        throw new BadRequestException(
          'The user has an unsupported role: ' + user.permission_level,
        );
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
