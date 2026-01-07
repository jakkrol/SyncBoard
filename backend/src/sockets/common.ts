import { Server, Socket } from "socket.io";
import { users, rooms } from "./states.ts";

export const broadcastPlayerList = (io: Server, room: string) => {
    const players = rooms[room].users;
        
        console.log(`Broadcasting player list to room ${room}:`, players);
        console.log(users[0]);
    io.to(room).emit("updatePlayerList", players);
};



export const commonSocketHandler = (io: Server, socket: Socket) => {
    socket.on("saveBoard", ({room, data}: {room: string, data: string}) => {
      console.log(`saveBoard received from ${socket.id} for room ${room}`);
      console.log(rooms[room].id)
      rooms[room].boardData = data;
      console.log(`Board saved for room ${room}`);
    });


    socket.on("draw", (data: any) => {
      console.log(`draw received from ${socket.id}:`, data);
      //socket.broadcast.emit("draw", data);
      socket.to(data.room).emit("draw", data);
    });


    
    socket.on("leave", (room: any) => {
      const user = users[socket.id];
      if (!user) return;

      //usuwa usera
      rooms[room].users = rooms[room].users.filter((id) => id !== socket.id);

      if (user.room === room) {
        console.log(`socket ${socket.id} left room ${room}`);

        socket.to(room).emit("userLeft", { id: socket.id });
        broadcastPlayerList(io,room);
        socket.leave(room);

        delete users[socket.id];
      }
    });



    socket.on("disconnect", () => {
      const room = users[socket.id].room;
      rooms[room].users = rooms[room].users.filter((id) => id !== socket.id);
      console.log(`user disconnected: ${socket.id}`);
      const user = users[socket.id];
      if(user){
        socket.to(user.room).emit("userLeft", {id: socket.id});
        delete users[socket.id];
      }
    });

};