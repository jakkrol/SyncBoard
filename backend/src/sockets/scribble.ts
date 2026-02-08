import { Server, Socket } from "socket.io";
import { users, rooms } from "./states.ts";
import { broadcastPlayerList } from "./common.ts";

export const scribbleSocketHandler = (io: Server, socket: Socket) => {
    socket.on("joinScribble", (roomId: string) =>{
      socket.join(roomId);
      console.log(`socket ${socket.id} joined scribble room ${roomId}`);

      users[socket.id] = {
        id: socket.id,
        room: roomId,
        name: `User_${socket.id.substring(0, 5)}`, // Or pass name from client
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      };
      
    if (!rooms[roomId]) {
      console.log(`Creating new Scribble room: ${roomId}`);
      
      rooms[roomId] = {
        id: roomId,
        type: 'scribble', 
        users: [socket.id], 
        boardData: "",      
        drawingUser: "",
        currentWord: ""    
      };   
      }else{
        console.log(`Joined existing scribble room: ${rooms[roomId]}`);
        rooms[roomId].users.push(socket.id);
      }

      broadcastPlayerList(io, rooms[roomId].id);
      //TO DO: MAKE SCRIBBLE ROOM LOGIC

    });



    socket.on("startScribbleGame", (room: string) => {
      console.log(`Starting scribble game in room ${room} as requested by ${socket.id}`);
      if(rooms[room].type !== "scribble") return;    
      
      io.in(room).emit("updateGameState", { drawingUser: rooms[room].users[0] }); // Set first user as drawing user
      socket.to(room).emit("startScribbleGameServer");    
    });



    socket.on("chatMessage", (data: any) => {
      console.log(`chatMessage from ${socket.id}:`, data);
      io.to(data.room).emit("chatMessage", {user: users[socket.id]?.name || "Unknown", text: data.text, time: new Date().toISOString() });
    });
};
