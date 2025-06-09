import { Server } from 'socket.io';
import { CustomSocket } from './types/socket';

export function setupSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket:CustomSocket) => {
    console.log('User connected:', socket.id);

    // Listen for user registration
    socket.on('register', ({ userId, tableId }: { userId: string; tableId: string }) => {
      socket.userId = userId;
      socket.tableId = tableId;

      console.log(`Registered: userId=${userId}, tableId=${tableId}`);

      // Optional: Join the user to a room based on tableId
      socket.join(tableId);
    });

    // Example: handle a message
    socket.on('send-message', (message: string) => {
      console.log(`User ${socket.userId} sent message: ${message} (table ${socket.tableId})`);

      if (socket.tableId) {
        // Broadcast to everyone in the same table
        socket.to(socket.tableId).emit('receive-message', {
          userId: socket.userId,
          message,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}
