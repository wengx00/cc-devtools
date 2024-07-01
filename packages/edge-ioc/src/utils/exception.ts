export class HttpException extends Error {
  status: number;

  detail: string;

  constructor(status: number, message: string) {
    super(`HttpException: ${status} ${message}`);
    this.status = status;
    this.detail = message;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class PaymentRequiredException extends HttpException {
  constructor(message: string = 'Payment Required') {
    super(402, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(message: string = 'Method Not Allowed') {
    super(405, message);
  }
}

export class NotAcceptableException extends HttpException {
  constructor(message: string = 'Not Acceptable') {
    super(406, message);
  }
}

export class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message: string = 'Proxy Authentication Required') {
    super(407, message);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message: string = 'Request Timeout') {
    super(408, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class GoneException extends HttpException {
  constructor(message: string = 'Gone') {
    super(410, message);
  }
}

export class LengthRequiredException extends HttpException {
  constructor(message: string = 'Length Required') {
    super(411, message);
  }
}

export class PreconditionFailedException extends HttpException {
  constructor(message: string = 'Precondition Failed') {
    super(412, message);
  }
}

// TODO: 其他错误码

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

export class NotImplementedException extends HttpException {
  constructor(message: string = 'Not Implemented') {
    super(501, message);
  }
}

export class BadGatewayException extends HttpException {
  constructor(message: string = 'Bad Gateway') {
    super(502, message);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(message: string = 'Service Unavailable') {
    super(503, message);
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(message: string = 'Gateway Timeout') {
    super(504, message);
  }
}

export class HTTPVersionNotSupportedException extends HttpException {
  constructor(message: string = 'HTTP Version Not Supported') {
    super(505, message);
  }
}
