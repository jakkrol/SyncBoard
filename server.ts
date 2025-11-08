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

  const boards: { [room: string]: string } = {};

  io.on("connection", (socket: any) => {
    console.log(`a user connected: ${socket.id}`);
    socket.on("join", (room: string) => {
      socket.join(room);
      console.log(`socket ${socket.id} joined room ${room}`);
      if(boards[room]) {
        socket.emit("loadBoard", boards[room]);
      }
    })

    socket.on("saveBoard", ({room, data}: {room: string, data: string}) => {
      boards[room] = data;
      console.log(`Board saved for room ${room}`);
    });

    socket.on("draw", (data: any) => {
      //console.log(`draw received from ${socket.id}:`, data);
      //socket.broadcast.emit("draw", data);
      socket.to(data.room).emit("draw", data);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
