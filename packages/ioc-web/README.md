# IoC-Web

> 🌟 Light-weight IoC Web Server. Base on **nothing**, just vanilla JavaScript!

You can use in Cloudflare Workers to use IoC pattern building a web service.

## Example

Entry `index.ts`:

```typescript
import {
  HttpException,
  InternalServerErrorException,
  IocFactory,
  formatLog,
} from '@cc-devtools/ioc-web';
import errorResponse from '@utils/error-response';

import { AppModule } from './AppModule';

const app = IocFactory.create(AppModule);

export default {
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async fetch(request, env, ctx): Promise<Response> {
    try {
      console.log(request.method, new URL(request.url).pathname);
      return await app.handleHttpRequest(request as any);
    } catch (err) {
      if (err instanceof HttpException) {
        return errorResponse(err);
      }
      return errorResponse(new InternalServerErrorException());
    }
  },
} satisfies ExportedHandler<Env>;
```

`AppModule.ts`:

```typescript
import { Module } from '@cc-devtools/ioc-web';
import { AuthModule } from '@routes/auth/AuthModule';

@Module({
  controllers: [],
  providers: [],
  modules: [AuthModule],
  base: 'api',
})
export class AppModule {}
```

`@routes/auth/AuthModule.ts`:

```typescript
import { Module } from '@cc-devtools/ioc-web';

import { UserController } from './user/UserController';
import { UserService } from './user/UserService';

@Module({
  controllers: [UserController],
  providers: [UserService],
  base: 'auth',
})
export class AuthModule {}
```

`@routes/auth/user/UserController.ts`:

```typescript
import { Controller, Get, Query } from '@cc-devtools/ioc-web';

import { UserService } from './UserService';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('say_hello')
  sayHello(@Query() query: Record<string, any>) {
    return this.service.sayHello(query);
  }
}
```

`@routes/auth/user/UserService.ts`:

```typescript
import { Injectable } from '@cc-devtools/ioc-web';
import CommonResponse from '@utils/common-response';

@Injectable()
export class UserService {
  sayHello(query: Record<string, any>) {
    return CommonResponse.ok(query);
  }
}
```

That's all! The valid HTTP request is `GET /api/auth/user/say_hello`

## Run with wrangler

1. **Use `rollup` or `SWC` to build your TypeScript code**

   > `wrangler` seems like not emit decoratorMetaData while running TypeScript. (That means the ioc-web framework can't get the metadata like `design:paramtypes`)

2. Change your `wrangler.toml` and set `main` to the output file built by Step 1.

3. Run `wrangler dev`

4. 🚀 Open Chrome and just do HTTP request!
