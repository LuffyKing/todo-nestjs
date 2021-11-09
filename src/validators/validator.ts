import { IsEmail } from 'class-validator';

export class EmailParamValidatiion {
  @IsEmail()
  email: string;
}
