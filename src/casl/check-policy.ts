import { SetMetadata } from '@nestjs/common';
import { CHECK_POLICIES_KEY } from 'src/constants';
import { PolicyHandler } from './policy.interface';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
