import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('Invalid login email/password');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user.id,
      permission_level: user.permission_level,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
