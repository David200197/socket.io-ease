import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const initSocket = (port: number) => {
  return new Promise<Socket<DefaultEventsMap, DefaultEventsMap>>((resolve, reject) => {
    // create socket for communication
    const socket = io(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
      reconnectionDelay: 0,
      forceNew: true,
    })

    // define event handler for sucessfull connection
    socket.on('connect', () => {
      resolve(socket)
    })

    socket.on('error', (error) => {
      console.log(error)
      reject(error)
    })

    socket.on('connect_error', (error) => {
      console.debug(error.message)
    })

    // if connection takes longer than 5 seconds throw error
    setTimeout(() => {
      reject(new Error('Failed to connect wihtin 5 seconds.'))
    }, 5000)
  })
}
