import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getStatus(): { status: 'UP' } {
    return this.appService.getHealth();
  }
}
