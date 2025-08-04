import React, { useCallback, useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import Peer from '../service/Peer';

const Room = () => {

    const socket=useSocket();

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream,setMyStream]=useState();
    const [remoteStream, setRemoteStream] = useState();



    // user:joined event
    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[]);



    // Call Button will come in action from this function and send call to other user
    const handleCallUserButton=useCallback(async()=>{

        // Get local media stream
        const stream=await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        console.log("Get Local media Stream :",stream);
        

        // Peer is your wrapper (or RTCPeerConnection directly)
        const offer=await Peer.getOffer();
        console.log("When press the call button - Offer:",offer);

        // signaling offer
        socket.emit('user:call',{to:remoteSocketId,offer});

        // store local media stream
        setMyStream(stream);
    },[remoteSocketId,socket]);




    const handleIncommingCall=useCallback(async({from,offer})=>{
        setRemoteSocketId(from);
        const stream=await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true,
        });
        setMyStream(stream);
        console.log(`Incomming Call`,from,offer);
        const ans=await Peer.getAnswer(offer);
        socket.emit('call:accepted',{to:from,ans});
    },[socket]);





    const sendStreams=()=>{
        for(const track of myStream.getTracks()){
            Peer.peer.addTrack(track,myStream);
        }
    };





    const handleCallAccepted=useCallback(async({from,ans})=>{
        Peer.setLocalDescription(ans);
        console.log("Call Aceepted :",);
    },[myStream]);





    const handleNegoNeeded=useCallback(async()=>{
        const offer=await Peer.getOffer();
        socket.emit('peer:nego:needed',{offer,to:remoteSocketId})
    },[remoteSocketId, socket]);





    const handleNegoNeedIncomming=useCallback(async({from,offer})=>{
        const ans=Peer.getAnswer(offer);
        socket.emit('peer:nego:done',{to:from,ans});
    },[socket]);





    const handleNegoNeedFinal=useCallback(async({ans})=>{
        await Peer.setLocalDescription(ans);
    },[]);





    useEffect(() => {
      Peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);
      return ()=>{
        Peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
      }
    }, [handleNegoNeeded]);




    

    useEffect(()=>{
        Peer.peer.addEventListener('track',async ev =>{
            const remoteStream=ev.streams
            setRemoteStream(remoteStream);
        })
    },[]);





    useEffect(()=>{
        socket.on('user:joined',handleUserJoined);
        socket.on('incomming:call',handleIncommingCall);
        socket.on('call:accepted',handleCallAccepted);
        socket.on('peer:nego:needed',handleNegoNeedIncomming);
        socket.on('peer:nego:final',handleNegoNeedFinal);
        return()=>{
            socket.off('user:joined',handleUserJoined);
            socket.off('incomming:call',handleIncommingCall);
            socket.off('call:accepted',handleCallAccepted);
            socket.off('peer:nego:needed',handleNegoNeedIncomming);
            socket.off('peer:nego:final',handleNegoNeedFinal);
        }
    },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted,handleNegoNeedIncomming,handleNegoNeedFinal]);

  return (
    <div>
        <h1>Room Page</h1>
        <h4>{remoteSocketId ? "Connected":"No One in Room"}</h4>
        {
            myStream && <button onClick={sendStreams}>Send Stream</button>
        }
        {
            remoteSocketId && <button onClick={handleCallUserButton}>CALL</button>
        }
        {
            myStream && (
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer playing height="200px" width="200px" url={myStream}/>
                </>
            )
        }

        {
            remoteStream && (
                <>
                    <h1>Remote Stream</h1>
                    <ReactPlayer playing height="200px" width="200px" url={remoteStream}/>
                </>
            )
        }
    </div>
  )
}

export default Room