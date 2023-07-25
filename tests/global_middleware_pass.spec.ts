import { test } from "@japa/runner";
import { SocketServer } from "../src";
import { EVENTS } from "./constants";
import { destroySocket, initSocket, listenSocket } from "./utils/socket";
import { PassMiddleware } from "./middlewares/PassMiddleware";

const SERVER_PORT = 5001;
const RES_MESSAGE = "THIS IS A RESPONSE";

const socketServer = new SocketServer();

socketServer.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
  socket.emit(EVENTS.TEST1.CLIENT, body);
});
socketServer.addMiddlewares([PassMiddleware, PassMiddleware, PassMiddleware]);
socketServer.start(SERVER_PORT);

test.group("SocketServer: Global Middleware Pass", (group) => {
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
});
