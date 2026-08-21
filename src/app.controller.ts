import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Root/health route — @Public() bypasses the global JwtAuthGuard.
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check / service root' })
  getHello(): string {
    return this.appService.getHello();
  }
}
