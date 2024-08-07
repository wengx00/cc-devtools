import { Body, Controller, Get, Post, Query } from '@cc-infra/edge-ioc';
import { File } from '@cc-infra/edge-ioc-adapter-express';
import { FileEntity } from 'src/utils/FileEntity';

import { DemoService } from './DemoService';
import { HelloReq } from './entity/ReqEntity';

@Controller('demo')
export class DemoController {
  constructor(private readonly service: DemoService) {}

  @Get('hello')
  hello(@Query() query: HelloReq) {
    return this.service.hello(query);
  }

  @Post('post')
  post(@Body() body: Record<string, any>) {
    return this.service.post(body);
  }

  @Post('file')
  file(@File('file') file: FileEntity) {
    return this.service.file(file);
  }
}
