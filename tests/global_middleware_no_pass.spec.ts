import { test } from '@japa/runner'
import { SocketIo, SocketServer } from '../src'
import { EVENTS } from './constants'
import { destroySocket, initSocket, listenSocket } from './utils/socket'
import { NotPassMiddleware } from './middlewares/NotPassMiddleware'

const SERVER_PORT = 5000
const RES_MESSAGE = 'THIS IS A RESPONSE'

const socketServer = new SocketServer(SERVER_PORT)

socketServer.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
  socket.emit(EVENTS.TEST1.CLIENT, body)
})
//socketServer.addMiddlewares([NotPassMiddleware])
socketServer.connection((_: SocketIo, { channels }) => {
  for (const channel of channels) console.log(channel)
})

test.group('SocketServer: Global Middleware No Pass', (group) => {
  group.teardown(() => {
    socketServer.close()
  })

  test(`Not pass middleware: Should throw a error`, async ({ assert }) => {
    const socketClient = await initSocket(SERVER_PORT)
    try {
      const serverResponse = listenSocket(EVENTS.TEST1.CLIENT, socketClient)

      const data4Server = { message: RES_MESSAGE }
      socketClient.emit(EVENTS.TEST1.TO, data4Server)

      await serverResponse
    } catch (error) {
      assert.exists(error)
    }

    await destroySocket(socketClient)
  })
})
