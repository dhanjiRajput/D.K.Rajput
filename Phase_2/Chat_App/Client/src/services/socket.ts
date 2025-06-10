import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';

export const socket:typeof Socket = io(SOCKET_URL, {
    autoConnect:false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});