import { Server } from 'socket.io'
import {
  InstanceServer,
  Metadata,
  SocketGroup,
  SocketIo,
  SocketController,
  SocketListeners,
  SocketReservatedEventOptions,
  SocketOptions,
  SocketReservedEvents,
} from './interfaces'
import { SocketControl } from './libs'

export class SocketServer extends SocketControl {
  private io: Server

  constructor(instanceServer: InstanceServer, fn?: () => void) {
    super()
    this.io = new Server(instanceServer, {
      transports: ['websocket'],
    })
    fn && fn()
  }

  public addListener<Ev extends string>(
    ev: Ev,
    controller: SocketController,
    { middlewares = [], prefix }: SocketOptions = {}
  ) {
    return super._addListener(ev, controller, { middlewares, prefix })
  }

  public addReservatedListener(
    ev: SocketReservedEvents,
    controller: SocketController,
    { middlewares = [] }: SocketReservatedEventOptions = {}
  ) {
    return super._addListener(ev, controller, { middlewares }, true)
  }

  private convertGroupToListener(group: SocketGroup) {
    const Setlisteners = new Map<string, SocketListeners>()
    for (const listener of this.listeners) {
      if (listener.isReservated) continue
      Setlisteners.set(listener.ev, listener)
    }

    const stack = [group]
    while (stack.length) {
      const { node, middlewares, prefix } = stack.pop()!
      for (const { controller, ev, middlewares: listenerMiddleware } of node.listeners) {
        const event = prefix ? `${prefix}/${ev}` : ev

        const listener = Setlisteners.get(event)
        if (listener) throw new Error(`the event ${event} exists`)

        Setlisteners.set(event, {
          ev: event,
          controller,
          middlewares: [...middlewares, ...node.middlewares, ...listenerMiddleware],
          isReservated: false,
        })
      }
      for (const group of node.groups) {
        stack.push({
          node: group.node,
          prefix:
            prefix && group.prefix
              ? `${prefix}/${group.prefix}`
              : prefix && !group.prefix
                ? prefix
                : group.prefix,
          middlewares: [...middlewares, ...node.middlewares, ...group.middlewares],
        })
      }
    }
    return Array.from(Setlisteners.values())
  }

  public connection(listener?: (socket: SocketIo, metadata: Metadata) => void) {
    this.io.on('connection', (socket) => {
      socket.use((event, next) => {
        event[1] = { body: { ...event[1] }, event: event[0] }
        next()
      })

      for (const middleware of this.middlewares)
        socket.use((event, next) => middleware.handler(event[1], { socket, io: this.io }, next))

      const listeners = this.groups.map((group) => this.convertGroupToListener(group)).flat()
      const transformedListeners = [...this.listeners, ...listeners].map((listener) =>
        listener.isReservated ? listener : { ...listener, ev: `/${listener.ev}` }
      )

      for (const { controller, ev, middlewares } of transformedListeners) {
        if (!controller) return

        for (const middleware of middlewares) {
          socket.use((event, next) =>
            event[0] === ev ? middleware.handler(event[1], { socket, io: this.io }, next) : next()
          )
        }

        socket.on(ev, (event) => controller(event, { socket, io: this.io }))
      }

      const events = transformedListeners.map(({ ev }) => ev)
      listener && listener(socket, { channels: events })
    })
  }

  close(fn?: (err?: Error | undefined) => void) {
    if (this.io) this.io.close(fn)
  }
}
