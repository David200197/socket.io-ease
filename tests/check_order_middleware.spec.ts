import { test } from "@japa/runner";
import { SocketServer } from "../src";
import { EVENTS } from "./constants";
import { destroySocket, initSocket, listenSocket } from "./utils/socket";
import { OrderMiddleware } from "./middlewares/OrderMiddleware";

const SERVER_PORT = 5004;

const socketServer = new SocketServer();

socketServer.addMiddlewares([new OrderMiddleware(0)]);
socketServer.addGroup(
  (node) => {
    node.addMiddlewares([new OrderMiddleware(2)]);
    node.addListener(
      EVENTS.TEST1.SERVER,
      ({ orders }, { socket }) => {
        socket.emit(EVENTS.TEST1.CLIENT, orders);
      },
      { middlewares: [new OrderMiddleware(3)] }
    );
    node.addGroup(
      (node) => {
        node.addListener(
          EVENTS.TEST2.SERVER,
          ({ orders }, { socket }) => {
            socket.emit(EVENTS.TEST2.CLIENT, orders);
          },
          { middlewares: [new OrderMiddleware(4)] }
        );
      },
      { middlewares: [new OrderMiddleware(3)] }
    );
  },
  { middlewares: [new OrderMiddleware(1)] }
);
socketServer.addGroup(
  (node) => {
    node.addListener(
      EVENTS.TEST3.SERVER,
      ({ orders }, { socket }) => {
        socket.emit(EVENTS.TEST3.CLIENT, orders);
      },
      {
        middlewares: [
          new OrderMiddleware(4),
          new OrderMiddleware(5),
          new OrderMiddleware(6),
        ],
      }
    );
  },
  {
    middlewares: [
      new OrderMiddleware(1),
      new OrderMiddleware(2),
      new OrderMiddleware(3),
    ],
  }
);

socketServer.start(SERVER_PORT);

test.group("SocketServer: Simple Socket", (group) => {
  group.teardown(async () => {
    socketServer.close();
  });

  test(`Return the correct data in event 1: Should return a orders`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(EVENTS.TEST1.CLIENT, socketClient);

    socketClient.emit(EVENTS.TEST1.TO, {});

    const res: any = await serverResponse;
    assert.deepEqual(res, [0, 1, 2, 3]);

    await destroySocket(socketClient);
  });

  test(`Return the correct data in event 2: Should return a orders`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(EVENTS.TEST2.CLIENT, socketClient);

    socketClient.emit(EVENTS.TEST2.TO, {});

    const res: any = await serverResponse;
    assert.deepEqual(res, [0, 1, 2, 3, 4]);

    await destroySocket(socketClient);
  });

  test(`Return the correct data in event 3: Should return a orders`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(EVENTS.TEST3.CLIENT, socketClient);

    socketClient.emit(EVENTS.TEST3.TO, {});

    const res: any = await serverResponse;
    assert.deepEqual(res, [0, 1, 2, 3, 4, 5, 6]);

    await destroySocket(socketClient);
  });
});
