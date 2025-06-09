import WebSocket,{WebSocketServer} from "ws";
import http from "http";

const server=http.createServer(function(req:any, res:any){
    console.log((new Date()) + ' Received request for ' + req.url);
    res.end("Hey There!....");
});

const io = new WebSocketServer({ server });
io.on('connection', function connection(socket) {
    socket.on('error',(err)=>console.error(err));

    socket.on('message', function message(data,isBinary) {
        io.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    socket.send('Welcome to the WebSocket server!');
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});