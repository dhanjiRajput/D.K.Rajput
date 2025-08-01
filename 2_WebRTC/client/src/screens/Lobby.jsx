import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {

  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');

  const navigate=useNavigate();
  const socket=useSocket()

  const submitHandler = useCallback((e) => {
    e.preventDefault();
    //First Event To call for socket from here data will send to socket server ....go to server file
    socket.emit("room:join",{email,room})
  },[email,room,socket]);

  const handleJoinRoom=useCallback((data)=>{
    const {email,room}=data;
    navigate(`/room/${room}`) 
  },[])

  useEffect(()=>{
    //second event came to server with data
    socket.on('room:join',handleJoinRoom);
    return()=>{
      socket.off('room:join',handleJoinRoom);
    }
  },[socket,handleJoinRoom])

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="room">Room:</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
        </div>
        <button>JOIN</button>
      </form>
    </div>
  )
}

export default Lobby