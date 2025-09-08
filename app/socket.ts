import { io } from "socket.io-client";

const serverURL = process.env.NEXT_PUBLIC_ENVIRONMENT === 'LOCAL'
  ? process.env.NEXT_PUBLIC_LOCAL_SERVER_URL
  : process.env.NEXT_PUBLIC_SERVER_URL;

export const socket = io(serverURL || '', {
  autoConnect: true,
});
