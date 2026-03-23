import { broadcastPlayerList } from "./sockets/common";
import { drawingSocketHandler } from "./sockets/drawing";
import { scribbleSocketHandler } from "./sockets/scribble";
import { commonSocketHandler } from "./sockets/common";

//const { createServer } = require("http");
import { createServer } from "http";
//const next = require("next");
//import next from "next";
//const { Server } = require("socket.io");
import { Server } from "socket.io";
//import { create } from "domain";

const frontendUrl = process.env.FRONTEND_URL;
console.log("Allowed Frontend URL:", frontendUrl);
const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 4000;  


const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', frontendUrl || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if (req.url === '/' || req.url === '/ping') {
    res.writeHead(200);
    res.end("SyncBoard Game Server is running!");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", frontendUrl].filter(Boolean) as string[],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"]
});


// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const httpServer = createServer(handle);
//   const io = new Server(httpServer, { 
//     cors: {
//       origin: "*", 
//       methods: ["GET", "POST"]
//     }
//   });

  // type User = {
  //   id: string;
  //   name: string;
  //   color: string;
  //   room: string;
  // }

  // interface BaseRoom {
  //   id: string;
  //   users: string[];
  //   boardData: string;
  // }

  // interface DrawingRoom extends BaseRoom {
  //   type: "drawing";
  // }

  // interface ScribbleRoom extends BaseRoom {
  //   type: "scribble";
  //   drawingUser: string;
  //   currentWord: string;
  // }

  // type Room = DrawingRoom | ScribbleRoom;

  // const rooms: { [roomId: string]: Room } = {};
  // const users: { [userId: string]: User } = {};


//   const broadcastPlayerList = (room: any) => {
//     const players = rooms[room].users;
        
//         console.log(`Broadcasting player list to room ${room}:`, players);
//         console.log(users[0]);
//     io.to(room).emit("updatePlayerList", players);
// };


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


    ////////SOCKET HANDLERS
    drawingSocketHandler(io, socket);
    scribbleSocketHandler(io, socket);
    commonSocketHandler(io, socket);
    ////////SOCKET HANDLERS 

//     socket.on("join", (room: string) => {
//       socket.join(room);

//       if(!rooms[room]){
//         rooms[room] = {
//           id: room,
//           type: "drawing",
//           users: [socket.id],
//           boardData: ""
//         }
//       }else{
//         rooms[room].users.push(socket.id);
//       }

//       console.log(`socket ${socket.id} joined room ${room}`);

//       users[socket.id] = {
//         id: socket.id,
//         room,
//         name: `User_${socket.id.substring(0, 5)}`,
//         color: '#' + Math.floor(Math.random()*16777215).toString(16)
//       };

//       if(rooms[room]) {
//         socket.emit("loadBoard", rooms[room].boardData);
//       }
//       const othersInRoom = Object.entries(users).filter(([id, user]) => user.room === room && id !== socket.id).map(([id, user]) => ({id, name: user.name, color: user.color}));
//       socket.emit("initializeCursors", othersInRoom); 
//       socket.to(room).emit("userJoined", {id: socket.id, name: users[socket.id].name, color: users[socket.id].color});
//       socket.emit("userJoined", {id: socket.id, name: users[socket.id].name, color: users[socket.id].color});


// // Object.entries(bots)
// //   .filter(([_, bot]) => bot.room === room)
// //   .forEach(([botId, bot]) => {
// //     socket.emit("userJoined", { id: botId, name: bot.name, color: bot.color });
// //   });
//     })


    // socket.on("saveBoard", ({room, data}: {room: string, data: string}) => {
    //   console.log(`saveBoard received from ${socket.id} for room ${room}`);
    //   console.log(rooms[room].id)
    //   rooms[room].boardData = data;
    //   console.log(`Board saved for room ${room}`);
    // });

    // socket.on("drawCursor", (data: any) => {
    //   const user = users[socket.id];
    //   //console.log(`drawCursor received from ${socket.id}:`, data);
    //   if (!user) {
    //     return; 
    //   }
      
    //   socket.to(data.room).emit("drawCursor", { id: socket.id, x: data.x, y: data.y, name: user.name, color: user.color });
    // });

    // socket.on("draw", (data: any) => {
    //   console.log(`draw received from ${socket.id}:`, data);
    //   //socket.broadcast.emit("draw", data);
    //   socket.to(data.room).emit("draw", data);
    // });

    // socket.on("leave", (room: any) => {
    //   const user = users[socket.id];
    //   if (!user) return;

    //   //usuwa usera
    //   rooms[room].users = rooms[room].users.filter((id) => id !== socket.id);

    //   if (user.room === room) {
    //     console.log(`socket ${socket.id} left room ${room}`);

    //     socket.to(room).emit("userLeft", { id: socket.id });
    //     broadcastPlayerList(io,room);
    //     socket.leave(room);

    //     delete users[socket.id];
    //   }
    // });

    // socket.on("disconnect", () => {
    //   console.log(`user disconnected: ${socket.id}`);
    //   const user = users[socket.id];
    //   if(user){
    //     socket.to(user.room).emit("userLeft", {id: socket.id});
    //     delete users[socket.id];
    //   }
    // });



    ///SCRIBBLE SECTION
    // socket.on("joinScribble", (roomId: string) =>{
    //   socket.join(roomId);
    //   console.log(`socket ${socket.id} joined scribble room ${roomId}`);


    //   users[socket.id] = {
    //     id: socket.id,
    //     room: roomId,
    //     name: `User_${socket.id.substring(0, 5)}`, // Or pass name from client
    //     color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    //   };
      
    // if (!rooms[roomId]) {
    //   console.log(`Creating new Scribble room: ${roomId}`);
      
    //   rooms[roomId] = {
    //     id: roomId,
    //     type: 'scribble', 
    //     users: [socket.id], 
    //     boardData: "",      
    //     drawingUser: socket.id,
    //     currentWord: ""    
    //   };
      
     
    //   }else{
    //     console.log(`Joined existing scribble room: ${rooms[roomId]}`);
    //     rooms[roomId].users.push(socket.id);
    //   }

    //   broadcastPlayerList(io, rooms[roomId].id);
    //   //TO DO: MAKE SCRIBBLE ROOM LOGIC

    // });

    // socket.on("startScribbleGame", (room: string) => {
    //   console.log(`Starting scribble game in room ${room} as requested by ${socket.id}`);
    //   socket.to(room).emit("startScribbleGameServer");    
    // });

    // socket.on("chatMessage", (data: any) => {
    //   console.log(`chatMessage from ${socket.id}:`, data);
    //   io.to(data.room).emit("chatMessage", {user: users[socket.id]?.name || "Unknown", text: data.text, time: new Date().toISOString() });
    // });

  });

  
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
//});
