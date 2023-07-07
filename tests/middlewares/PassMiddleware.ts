import {
  SocketConnection,
  SocketMiddleware,
  SocketNext,
  SocketRequest,
} from '../../src/index'

export class PassMiddleware implements SocketMiddleware {
  handler({ }: SocketRequest, { }: SocketConnection, next: SocketNext) {
    next()
  }
}
