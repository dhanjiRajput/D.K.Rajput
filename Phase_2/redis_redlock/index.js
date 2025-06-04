import Redis from 'ioredis';
import { Redlock } from 'redlock';
import express from 'express';
const app = express();

const redis1 = new redis({ host: "127.0.0.1", port: 6379 });
const redis2 = new redis({ host: "127.0.0.1", port: 6380 });
const redis3 = new redis({ host: "127.0.0.1", port: 6381 });

const redlock=new Redlock({
    clients:[redis1,redis2,redis3],
    retryCount: 3,
    retryDelay: 200,
});

app.post('/lock', async (req, res) => {
    let lock;

    try {
        lock=await redlock.acquire(["lock:item1"],5000);
    
        const stock=await redis1.get("stock:item1")||1;
        if(stock>0){
            await redis1.set("stck:item1",stock-1);
            await lock.release();
            res.status(200).send("Item purchased successfully");
        }else{
            await lock.release();
            res.status(400).send("Item out of stock");
        }
    } catch (error) {
        return res.status(423).send("Error acquiring lock or processing request");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});