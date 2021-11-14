import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './policy.guard';

@Module({
  exports: [CaslAbilityFactory, PoliciesGuard],
  providers: [CaslAbilityFactory, PoliciesGuard],
})
export class CaslModule {}
