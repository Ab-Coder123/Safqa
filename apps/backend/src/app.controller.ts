import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipThrottle } from './common/decorators/throttle.decorator';

@Controller()
export class AppController {
  @SkipThrottle()
  @Get()
  @HttpCode(HttpStatus.OK)
  getRoot() {
    return {
      status: 'ok',
      service: 'safqa-backend',
      timestamp: new Date().toISOString(),
    };
  }

  @SkipThrottle()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      service: 'safqa-backend',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
