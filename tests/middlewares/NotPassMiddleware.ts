import { SocketConnection, SocketMiddleware, SocketNext, SocketRequest } from '../../src/index'

export class NotPassMiddleware implements SocketMiddleware {
  handler({ }: SocketRequest, { socket }: SocketConnection) {
    socket.emit("error_handler")
  }
}
