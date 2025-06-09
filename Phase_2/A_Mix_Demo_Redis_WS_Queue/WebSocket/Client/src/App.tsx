import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(socket);
    };
    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessage(event.data);
    };
    setSocket(socket);
  },[]);

  if(!socket){
    return <div>Loading.....</div>
  }
  return (
    <>
      {message}
    </>
  )
}

export default App
