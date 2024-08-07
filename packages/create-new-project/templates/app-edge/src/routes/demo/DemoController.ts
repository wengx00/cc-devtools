import { Controller, Get } from '@cc-infra/edge-ioc';

import { DemoService } from './DemoService';

@Controller('demo')
export class DemoController {
  constructor(private readonly service: DemoService) {}

  @Get('hello')
  hello() {
    return this.service.hello();
  }
}
