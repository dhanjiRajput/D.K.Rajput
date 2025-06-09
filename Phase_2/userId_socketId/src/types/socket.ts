import { Socket as DefaultSocket } from 'socket.io';

export interface CustomSocket extends DefaultSocket {
  userId?: string;
  tableId?: string;
}
