import React from "react";
import { useEffect } from "react";
import {io} from 'socket.io-client'
import {Button, Container, TextField, Typography} from '@mui/material'
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket=useMemo(()=>io('http://localhost:3000'),[]);

  const [message,setMessage]=useState("");
  const [room,setRoom]=useState("");
  const [socketId,setSocketId]=useState("");
  const [dis,setDis]=useState([]);
  const [roomName,setRoomName]=useState("");

  const handlesubmit=(e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
  }

  const joinroomhandler=(e)=>{
    e.preventDefault();
    socket.emit("join",roomName);
  }
  useEffect(()=>{
    socket.on('connect',()=>{
      setSocketId(socket.id);
      console.log('user connected',socket.id);
    }); 

    socket.on('receive',(data)=>{
      setDis((dis)=>[...dis,data]);
    })

    return ()=>{
      socket.disconnect();
    }
  },[]);
  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinroomhandler}>
        <TextField id="outlined-basic" value={roomName} onChange={e=>setRoomName(e.target.value)} label="Room Name" variant="outlined"></TextField>
        <Button type="submit" variant="contained" color="primary">Join</Button>
      </form>
      <form onSubmit={handlesubmit}>
        <TextField id="outlined-basic" value={message} onChange={e=>setMessage(e.target.value)} label="Message" variant="outlined"></TextField>
        <TextField id="outlined-basic" value={room} onChange={e=>setRoom(e.target.value)} label="Room" variant="outlined"></TextField>
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>

    
          {dis.map((m,i)=>(
              <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
              </Typography>
          ))}
     
    </Container>
  )
}
export default App