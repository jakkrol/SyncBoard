// server.ts
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket: any) => {
    console.log(`a user connected: ${socket.id}`);


    socket.on("moveCard", (data: any) => {
      console.log(`moveCard received from ${socket.id}:`, data);
      socket.broadcast.emit("moveCard", data);
    });


    socket.on("draw", (data: any) => {
      console.log(`draw received from ${socket.id}:`, data);
      socket.broadcast.emit("draw", data);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
