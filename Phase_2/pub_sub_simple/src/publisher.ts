import {createClient} from 'redis';
const publisher= createClient();

async function publishMessage() {
    await publisher.connect();
    
    setInterval(async () => {
        const message=`Hello, Boom Guys ,this is a message from the publisher at ${new Date().toISOString()}`;
        await publisher.publish('my-channel', message);
        console.log(`Published message: ${message}`);
    },2000);
};
publishMessage();