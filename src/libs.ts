import {
  SocketController,
  SocketNodeFunction,
  SocketGroup,
  SocketInstanceMiddleware,
  SocketListeners,
  SocketMiddleware,
  SocketOptions,
} from './interfaces'

export abstract class SocketControl {
  private _listeners: Map<string, SocketListeners> = new Map()
  private _groups: SocketGroup[] = []
  private _middlewares: SocketMiddleware[] = []

  protected isClassMiddleware = (value: any): value is SocketMiddleware => value?.handler
  protected mapMiddleware = (middlewares: (SocketMiddleware | SocketInstanceMiddleware)[]) =>
    middlewares.map((middleware) => {
      if (this.isClassMiddleware(middleware)) {
        return middleware
      }
      return new middleware()
    })

  public addMiddlewares(middlewares: (SocketMiddleware | SocketInstanceMiddleware)[]) {
    this._middlewares = [...this._middlewares, ...this.mapMiddleware(middlewares)]
    return this
  }

  public addGroup(
    groupFunction: SocketNodeFunction,
    { middlewares = [], prefix }: SocketOptions = {}
  ) {
    const group = new SocketNode()
    groupFunction(group)
    this._groups.push({
      node: group,
      prefix,
      middlewares: this.mapMiddleware(middlewares),
    })
    return this
  }

  protected _addListener<Ev extends string>(
    ev: Ev,
    controller: SocketController,
    { middlewares = [], prefix }: SocketOptions = {},
    isReservated = false
  ) {
    const event = prefix ? `${prefix}/${ev}` : ev

    const listener = this._listeners.get(event)

    if (listener) throw new Error(`the event ${event} exists`)

    this._listeners.set(event, {
      ev: event,
      controller,
      middlewares: this.mapMiddleware(middlewares),
      isReservated,
    })
    return this
  }

  public get listeners() {
    return Array.from(this._listeners.values())
  }

  public get middlewares() {
    return this._middlewares
  }

  public get groups() {
    return this._groups
  }
}

export class SocketNode extends SocketControl {
  public addListener<Ev extends string>(
    ev: Ev,
    controller: SocketController,
    { middlewares = [], prefix }: SocketOptions = {}
  ) {
    return super._addListener(ev, controller, { middlewares, prefix })
  }
}
