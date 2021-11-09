import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: 'UP' } {
    return { status: 'UP' };
  }
}
