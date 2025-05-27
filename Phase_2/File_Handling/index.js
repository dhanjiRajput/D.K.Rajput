const express=require("express");
const fs=require("fs");
const zlib=require("zlib")
const status=require("express-status-monitor");
const app=express();

//to create zip file
fs.createReadStream("./large-file.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("./sample.zip")))

app.use(status())
app.get("/", async (req, res) => {
    //using Stream we can send data in small small parts instead of at a time large file because of memory consumtion
    // const stream=fs.createReadStream("./large-file.txt","utf-8");
});

app.listen(3000,()=>{
    console.log("Server Started on Port No. 3000");
});

// //  create automattically Synchronously new file , two arguments required(fileName,fileData)
// //     we are not using much synchronus file
// fs.writeFileSync("./test.txt","Hello, I am a new File..");


// //  create automattically Asychronously new file , three arguments required(fileName,fileData,callback function to show error)
// fs.writeFile("./asyncTestFile.txt","Hello i am asynchnously created file i wont block any other request after me",(err)=>{})

// Read file synchronously which already created  and return the data
// const read=fs.readFileSync("./test.txt","utf-8");
// console.log(read);

//Read file asynchnously which not retuned anything
// fs.readFile("./test.txt","utf-8",(err,result)=>{
//     if(err){
//         console.log("Reading File Error");
//     }else{
//         console.log(result);
//     }
// });

// fs.appendFileSync("./test.txt",Date.now().toString());