<div style="display:flex; width:100%; align-items: center; flex-direction: column" >
    <img src="./docs/logo.svg" width="200px" ></img>
    <h2>Socket.io-ease</h2>
</div>

## Description

## Installation

Socket.io-ease is built as an abstraction layer on top of socket.io gathering concepts from libraries, such as express.js and adonis.js in order to provide a straightforward and organized structure in our projects.

#### npm:

```
npm install socket.io-ease
```

#### yarn:

```
yarn add socket.io-ease
```

## Usability

Create a SocketServer instance with server argument or port number as a [socket.io](https://github.com/socketio/socket.io#module-syntax)

```ts
import { SocketServer } from "socket.io-ease";
import server from "src/server"

/*the server can be from any framework or library 
(express, koa, fastity, adoniss.js) or simply standalone*/
const socketServer = new SocketServer(server);
```

```ts
import { SocketServer } from "socket.io-ease";
import server from "src/server";
import controller from "src/controller";

const socketServer = new SocketServer(server);
socketServer.addListener("example", controller);
socketServer.connection();
```

```ts
import { SocketServer, SocketNode } from "socket.io-ease";
import server from "src/server";
import controller from "src/controller";

const exampleGroup = (node: SocketNode) => {
  node.addListener("example", controller)
}

const socketServer = new SocketServer(server);
socketServer.addGroup(exampleGroup)
socketServer.connection();
```

```ts
import { SocketServer, SocketNode } from "socket.io-ease";
import server from "src/server";
import controller from "src/controller";

const exampleGroup = (node: SocketNode) => {
  node.addListener("example", controller, { prefix: "foo" })
}

const socketServer = new SocketServer(server);
socketServer.addGroup(exampleGroup, { prefix: "bee" })
socketServer.connection();
```


```ts
import { SocketServer, SocketMiddleware, SocketConnection, SocketNext, SocketRequest } from "socket.io-ease";
import server from "src/server";
import controller from "src/controller";

class Middleware implements SocketMiddleware {
  handler: (request: SocketRequest, connection: SocketConnection, next: SocketNext) => {
    //some logic
    next()
  };
}

const exampleGroup = (node: SocketNode) => {
  node.addListener("example", controller, { middlewares: [Middleware] })
}

const socketServer = new SocketServer(server);
socketServer.addGroup(exampleGroup, { middlewares: [Middleware] })
socketServer.connection();
```

```ts
const controller = (request: SocketRequest, connection: SocketConnection) => { 
    //logic
}
export default controller
```