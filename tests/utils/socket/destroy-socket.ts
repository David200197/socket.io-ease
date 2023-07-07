import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const destroySocket = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  return new Promise((resolve) => {
    if (socket.connected) {
      socket.disconnect()
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
