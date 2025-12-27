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
  const users: { [socketId: string]: { room: string; name: string; color: string } } = {};

  const scribbleRooms: {[room: string]: { room: string; drawingUser: string; currentWord: string }} = {};




  const broadcastPlayerList = (room: any) => {
    const players = Object.values(users)
        .filter(u => u.room === room)
        .map(u => ({ name: u.name, color: u.color })); // Send safe data
        
        console.log(`Broadcasting player list to room ${room}:`, players);
        console.log(users[0]);
    io.to(room).emit("updatePlayerList", players);
};

//   const bots: { [botId: string]: { room: string, name: string, color: string } } = {
//   bot1: { room: "room1", name: "Bot", color: "cyan" },
//   bot2: { room: "room1", name: "Bot2", color: "yellow" },
//   bot3: { room: "room1", name: "Bot3", color: "red" }
// };

// //Move bot every 100ms
// setInterval(() => {
//   Object.entries(bots).forEach(([botId, bot]) => {
//     const x = Math.random() * 1400;
//     const y = Math.random() * 800;
//     io.to(bot.room).emit("drawCursor", { id: botId, x, y, name: bot.name, color: bot.color });
//   });
// }, 1000);




  io.on("connection", (socket: any) => {
    console.log(`a user connected: ${socket.id}`);

    socket.on("join", (room: string) => {
      socket.join(room);
      console.log(`socket ${socket.id} joined room ${room}`);

      users[socket.id] = {
        room,
        name: `User_${socket.id.substring(0, 5)}`,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };

      if(boards[room]) {
        socket.emit("loadBoard", boards[room]);
      }
      const othersInRoom = Object.entries(users).filter(([id, user]) => user.room === room && id !== socket.id).map(([id, user]) => ({id, name: user.name, color: user.color}));
      socket.emit("initializeCursors", othersInRoom); 
      socket.to(room).emit("userJoined", {id: socket.id, name: users[socket.id].name, color: users[socket.id].color});
      socket.emit("userJoined", {id: socket.id, name: users[socket.id].name, color: users[socket.id].color});


// Object.entries(bots)
//   .filter(([_, bot]) => bot.room === room)
//   .forEach(([botId, bot]) => {
//     socket.emit("userJoined", { id: botId, name: bot.name, color: bot.color });
//   });
    })


    socket.on("saveBoard", ({room, data}: {room: string, data: string}) => {
      boards[room] = data;
      console.log(`Board saved for room ${room}`);
    });

    socket.on("drawCursor", (data: any) => {
      const user = users[socket.id];
      console.log(`drawCursor received from ${socket.id}:`, data);
      if (!user) {
        return; 
      }
      
      socket.to(data.room).emit("drawCursor", { id: socket.id, x: data.x, y: data.y, name: user.name, color: user.color });
    });

    socket.on("draw", (data: any) => {
      console.log(`draw received from ${socket.id}:`, data);
      //socket.broadcast.emit("draw", data);
      socket.to(data.room).emit("draw", data);
    });

    socket.on("leave", (room: any) => {
      const user = users[socket.id];
      if (!user) return;

      if (user.room === room) {
        console.log(`socket ${socket.id} left room ${room}`);

        socket.to(room).emit("userLeft", { id: socket.id });
        socket.leave(room);

        delete users[socket.id];
      }
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
      const user = users[socket.id];
      if(user){
        socket.to(user.room).emit("userLeft", {id: socket.id});
        delete users[socket.id];
      }
    });



    ///SCRIBBLE SECTION
    socket.on("joinScribble", (room: string) =>{
      socket.join(room);
      console.log(`socket ${socket.id} joined scribble room ${room}`);
      

      if(!scribbleRooms[room]){
        console.log(`Creating new Scribble room: ${room}`);
        scribbleRooms[room] = {
          room,
          drawingUser: socket.id,
          currentWord: "Wainting..."
        };
      }else{
        console.log(`Joined existing scribble room: ${room}`);
      }
      broadcastPlayerList(room);
      //TO DO: MAKE SCRIBBLE ROOM LOGIC

    });

    socket.on("startScribbleGame", (room: string) => {
      console.log(`Starting scribble game in room ${room} as requested by ${socket.id}`);
      socket.to(room).emit("startScribbleGameServer");
    });

    socket.on("chatMessage", (data: any) => {
      console.log(`chatMessage from ${socket.id}:`, data);
      io.to(data.room).emit("chatMessage", {user: users[socket.id]?.name || "Unknown", text: data.text, time: new Date().toISOString() });
    });

  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
