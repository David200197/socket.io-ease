import { test } from "@japa/runner";
import { SocketServer } from "../src";
import { EVENTS, GROUP1 } from "./constants";
import { destroySocket, initSocket, listenSocket } from "./utils/socket";
import { NotPassMiddleware } from "./middlewares/NotPassMiddleware";
import { PassMiddleware } from "./middlewares/PassMiddleware";

const SERVER_PORT = 5003;
const RES_MESSAGE = "THIS IS A RESPONSE";

const socketServer = new SocketServer();

socketServer.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
  socket.emit(EVENTS.TEST1.CLIENT, body);
});

socketServer.addListener(
  EVENTS.TEST1.SERVER,
  ({ body }, { socket }) => {
    socket.emit(EVENTS[GROUP1].TEST1.CLIENT, body);
  },
  { prefix: GROUP1 }
);

socketServer.addListener(
  EVENTS.TEST2.SERVER,
  ({ body }, { socket }) => {
    socket.emit(EVENTS.TEST2.CLIENT, body);
  },
  {
    middlewares: [PassMiddleware, PassMiddleware, PassMiddleware],
  }
);

socketServer.addListener(
  EVENTS.TEST3.SERVER,
  ({ body }, { socket }) => {
    socket.emit(EVENTS.TEST3.CLIENT, body);
  },
  { middlewares: [NotPassMiddleware] }
);
socketServer.start(SERVER_PORT);

test.group("SocketServer: Simple Socket", (group) => {
  group.teardown(async () => {
    socketServer.close();
  });

  test(`Return the correct data: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(EVENTS.TEST1.CLIENT, socketClient);

    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS.TEST1.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });
  test(`Return the correct data with prefix: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(
      EVENTS[GROUP1].TEST1.CLIENT,
      socketClient
    );

    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS[GROUP1].TEST1.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });
  test(`Pass all middlewares: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(EVENTS.TEST2.CLIENT, socketClient);

    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS.TEST2.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });
});
