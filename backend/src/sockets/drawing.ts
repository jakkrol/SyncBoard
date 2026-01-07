import { Server, Socket } from "socket.io";
import { users, rooms } from "./states.ts";
import { broadcastPlayerList } from "./common.ts";

export const drawingSocketHandler = (io: Server, socket: Socket) => {
    socket.on("join", (room: string) => {
      socket.join(room);

      if(!rooms[room]){
        rooms[room] = {
          id: room,
          type: "drawing",
          users: [socket.id],
          boardData: ""
        }
      }else{
        rooms[room].users.push(socket.id);
      }

      console.log(`socket ${socket.id} joined room ${room}`);

      users[socket.id] = {
        id: socket.id,
        room,
        name: `User_${socket.id.substring(0, 5)}`,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };

      if(rooms[room]) {
        socket.emit("loadBoard", rooms[room].boardData);
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



    socket.on("drawCursor", (data: any) => {
      const user = users[socket.id];
      //console.log(`drawCursor received from ${socket.id}:`, data);
      if (!user) {
        return; 
      }
      
      socket.to(data.room).emit("drawCursor", { id: socket.id, x: data.x, y: data.y, name: user.name, color: user.color });
    });





}