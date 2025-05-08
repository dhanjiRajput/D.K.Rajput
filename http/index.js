const http=require('http');

const server=http.createServer((req,res)=>{
    if(req.url==="/"){
        res.write("Hello World");
        res.end();
    }

    if(req.url==="/api/v1"){
        res.write(JSON.stringify(['hello','world']));
        res.end();
    }
});

server.listen(3000);
console.log("server Started on port 3000");
