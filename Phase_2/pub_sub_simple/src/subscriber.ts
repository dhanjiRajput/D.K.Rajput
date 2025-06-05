import {createClient} from 'redis';
import {Server} from 'socket.io'



export async function subscribeToChannel(io:Server) {
    const subscriber = createClient();
    await subscriber.connect();
    
    await subscriber.subscribe('my-channel', (message) => {
        console.log(`Received message: ${message}`);
        io.emit('chat-message', message);
    });
}