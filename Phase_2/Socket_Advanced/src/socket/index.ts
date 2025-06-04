import { Server, Socket } from 'socket.io';
import redis from '../redis';
import Message from '../models/message.model';


export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) redis.set(`user:${userId}`, socket.id);

    socket.on('message', async ({ to, content }: { to: string; content: string }) => {
      const from = userId;
      await Message.create({ sender: from, receiver: to, content });
      const toSocketId = await redis.get(`user:${to}`);
      if (toSocketId) io.to(toSocketId).emit('message', { from, content });
    });

    socket.on('disconnect', () => {
      if (userId) redis.del(`user:${userId}`);
    });
  });
};