import {createClient} from 'redis';
import {Server} from 'socket.io';

export async function subscriberToChannel(io: Server) {
    const subscriber=createClient();
    subscriber.connect();

    await subscriber.subscribe('notifications', (message) => {
        console.log('[Redis] Recieved', message);
        io.emit('notification', message);
    });
};