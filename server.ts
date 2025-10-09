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
      origin: "*", // allow all for testing
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket: any) => {
    console.log(`a user connected: ${socket.id}`);

    // Listen for moveCard events from this client
    socket.on("moveCard", (data: any) => {
      console.log(`moveCard received from ${socket.id}:`, data);

      // Broadcast to all other clients
      socket.broadcast.emit("moveCard", data);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
