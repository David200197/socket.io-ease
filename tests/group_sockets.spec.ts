import { test } from "@japa/runner";
import { SocketServer, SocketNode } from "../src";
import { EVENTS, GROUP1 } from "./constants";
import { destroySocket, initSocket, listenSocket } from "./utils/socket";
import { PassMiddleware } from "./middlewares/PassMiddleware";
import { NotPassMiddleware } from "./middlewares/NotPassMiddleware";

const SERVER_PORT = 5007;
const RES_MESSAGE = "THIS IS A RESPONSE";

const groupWithPrefix = (node: SocketNode) => {
  node.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
    socket.emit(EVENTS[GROUP1].TEST1.CLIENT, body);
  });
};

const groupWithoutPrefix = (node: SocketNode) => {
  node.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
    socket.emit(EVENTS[GROUP1].TEST1.CLIENT, body);
  });
};

const groupWithoutPrefixMiddleware = (node: SocketNode) => {
  node.addListener(
    EVENTS.TEST2.SERVER,
    ({ body }, { socket }) => {
      socket.emit(EVENTS[GROUP1].TEST1.CLIENT, body);
    },
    { middlewares: [PassMiddleware] }
  );
};

const groupWithoutPrefixNotPassMiddleware = (node: SocketNode) => {
  node.addListener(
    EVENTS.TEST3.SERVER,
    ({ body }, { socket }) => {
      socket.emit(EVENTS[GROUP1].TEST1.CLIENT, body);
    },
    { middlewares: [PassMiddleware] }
  );
};

const socketServer = new SocketServer();
socketServer.addGroup(groupWithPrefix, { prefix: GROUP1 });
socketServer.addGroup(groupWithoutPrefix);
socketServer.addGroup(groupWithoutPrefixMiddleware, {
  middlewares: [PassMiddleware],
});
socketServer.addGroup(groupWithoutPrefixNotPassMiddleware, {
  middlewares: [NotPassMiddleware],
});

socketServer.start(SERVER_PORT);

test.group("SocketServer: Group Socket", (group) => {
  group.teardown(() => {
    socketServer.close();
  });

  test(`Return the correct data without a global prefix: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(
      EVENTS[GROUP1].TEST1.CLIENT,
      socketClient
    );
    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS.TEST1.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });

  test(`Return the correct data with a global prefix: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(
      EVENTS[GROUP1].TEST1.CLIENT,
      socketClient
    );
    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS.TEST1.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });

  test(`Pass all middlewares: Should return a message "${RES_MESSAGE}"`, async ({
    assert,
  }) => {
    const socketClient = await initSocket(SERVER_PORT);
    const serverResponse = listenSocket(
      EVENTS[GROUP1].TEST1.CLIENT,
      socketClient
    );

    const data4Server = { message: RES_MESSAGE };
    socketClient.emit(EVENTS.TEST2.TO, data4Server);

    const res: any = await serverResponse;
    assert.equal(res.message, RES_MESSAGE);

    await destroySocket(socketClient);
  });
});
