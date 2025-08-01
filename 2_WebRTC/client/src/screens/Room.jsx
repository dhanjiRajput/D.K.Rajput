import React, { useCallback, useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';
import { useState } from 'react';

const Room = () => {
    const socket=useSocket();

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream,setMyStream]=useState();

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[]);

    const handleCallUser=useCallback(async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        setMyStream(stream);
    },[])

    useEffect(()=>{
        socket.on('user:joined',handleUserJoined);
        return()=>{
            socket.off('user:joined',handleUserJoined);
        }
    },[socket,handleUserJoined]);

  return (
    <div>
        <h1>Room Page</h1>
        <h4>{remoteSocketId ? "Connected":"No One in Room"}</h4>
        {
            remoteSocketId && <button onClick={handleCallUser}>CALL</button>
        }
        {
            myStream && <ReactPlayer playing height="200px" width="200px" url={myStream}/>
        }
    </div>
  )
}

export default Room