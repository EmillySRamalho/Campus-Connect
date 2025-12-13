import { io as ClientIO, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = ClientIO("https://campus-connect-1-t5v9.onrender.com", { 
      auth: { userId }
    });
  }
  return socket;
};

export const getSocket = () => socket;