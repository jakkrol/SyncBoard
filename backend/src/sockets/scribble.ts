import { Server, Socket } from "socket.io";
import { users, rooms } from "./states.ts";
import { broadcastPlayerList } from "./common.ts";
import getWord from "../utils/getWord.ts";
import { get } from "http";

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
        currentWord: "" ,
        alreadyDrawnUsers: []  ,
        scoreboard: {},
        round: 1
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
      
      for(const userId of rooms[room].users){
        rooms[room].scoreboard[userId] = 0;
      }

      rooms[room].drawingUser = rooms[room].users[0]; 

      //get word from the list of words
      var word = getWord();
      if(!word){
        throw new Error("Failed to get word for scribble game");
      }
      rooms[room].currentWord = word;

      io.in(room).emit("updateGameState", { drawingUser: rooms[room].drawingUser, currentWord: rooms[room].currentWord, round: rooms[room].round, scoreboard: rooms[room].scoreboard });
      socket.to(room).emit("startScribbleGameServer");
    });



    socket.on("chatMessage", (data: any) => {
      console.log(`chatMessage from ${socket.id}:`, data);
      io.to(data.room).emit("chatMessage", {user: users[socket.id]?.name || "Unknown", text: data.text, time: new Date().toISOString() });
    });


    socket.on("correctGuess", (data: any) => {
      console.log(`correctGuess from ${socket.id}:`, data);
      console.log(data.room);
      const currentRoom = rooms[data.room];
      if(currentRoom.type == "scribble"){
        currentRoom.scoreboard[socket.id] += 1;
        currentRoom.alreadyDrawnUsers.push(currentRoom.drawingUser);
        //console.log("Already drawn users:", currentRoom.alreadyDrawnUsers);

        if(currentRoom.alreadyDrawnUsers.length === currentRoom.users.length){
          console.log("All users have drawn. Next round.");
          currentRoom.alreadyDrawnUsers = [];
          currentRoom.round += 1;
        }

        currentRoom.drawingUser = currentRoom.users.find((id) => !currentRoom.alreadyDrawnUsers.includes(id)) || "";

        //to change to get new word from the list of words
        var word = getWord();
        if(!word){
          throw new Error("Failed to get word for scribble game");
        }
        currentRoom.currentWord = word; 
        console.log("New drawing user:", currentRoom.drawingUser);
        io.in(data.room).emit("updateGameState", { drawingUser: currentRoom.drawingUser, currentWord: currentRoom.currentWord, round: currentRoom.round, scoreboard: currentRoom.scoreboard });
      }
    })


};
