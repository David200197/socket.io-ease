import { test } from "@japa/runner";
import { SocketServer } from "../src";
import { EVENTS } from "./constants";

const socketServer = new SocketServer();

test.group("SocketServer: Same Event Error", () => {
  test(`The event exists: Should throw a error`, async ({ assert }) => {
    try {
      socketServer.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
        socket.emit(EVENTS.TEST1.TO, body);
      });
      socketServer.addListener(EVENTS.TEST1.SERVER, ({ body }, { socket }) => {
        socket.emit(EVENTS.TEST1.TO, body);
      });
    } catch (error) {
      assert.exists(error);
    }
  });
});
