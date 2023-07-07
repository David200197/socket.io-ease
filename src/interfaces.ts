import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ExtendedError } from 'socket.io/dist/namespace'
import { SocketNode } from './libs'

export type InstanceServer = ConstructorParameters<typeof Server>[0]
export type SocketReservedEvents = 'connect' | 'disconnect' | 'connect_error' | 'connect_failed'
export type SocketIo = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export type SocketNext = (err?: ExtendedError | undefined) => void
export type SocketRequest = { body: any; event: string; [x: string]: any }
export type SocketConnection = { socket: SocketIo; io: Server }
export type SocketMiddleware = {
  handler: (request: SocketRequest, connection: SocketConnection, next: SocketNext) => void
}
export type SocketInstanceMiddleware = { new (...args: any[]): SocketMiddleware }
export type SocketController = (request: SocketRequest, connection: SocketConnection) => void
export type SocketNodeFunction = (node: SocketNode) => void
export type SocketOptions = {
  middlewares?: (SocketMiddleware | SocketInstanceMiddleware)[]
  prefix?: string
}
export type SocketReservatedEventOptions = {
  middlewares?: (SocketMiddleware | SocketInstanceMiddleware)[]
}
export type SocketListeners = {
  ev: string
  controller: SocketController
  middlewares: SocketMiddleware[]
  isReservated: boolean
}
export type SocketGroup = {
  prefix?: string
  node: SocketNode
  middlewares: SocketMiddleware[]
}
export type Metadata = {
  channels: string[]
}
