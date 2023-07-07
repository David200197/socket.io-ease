import {
  SocketConnection,
  SocketMiddleware,
  SocketNext,
  SocketRequest,
} from '../../src/index'

export class OrderMiddleware implements SocketMiddleware {
  constructor(public readonly order: number) { }

  handler(request: SocketRequest, _: SocketConnection, next: SocketNext) {
    if (!request.orders) request.orders = []
    request.orders.push(this.order)
    next()
  }
}
