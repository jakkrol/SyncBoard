// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const getSocket = () => {
//   if (!socket) {
//     socket = io("http://localhost:3000");

//     socket.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });
//   }
//   return socket;
// };

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const getSocket = () => {
  if (!socket) {
    socket = io(url);

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

