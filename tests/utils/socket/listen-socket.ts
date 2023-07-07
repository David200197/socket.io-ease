import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const listenSocket = (
  event: string,
  socketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  return new Promise((resolve, reject) => {
    socketClient.on(event, (data4Client) => resolve(data4Client))

    socketClient.on("error_handler", () => reject())

    setTimeout(() => {
      reject(new Error('Failed to get reponse, connection timed out...'))
    }, 5000)
  })
}
