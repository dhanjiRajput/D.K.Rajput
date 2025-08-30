import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import Peer from '../service/Peer';

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // 🧠 Unified media access with cleanup
  const getMediaStream = async () => {
    try {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);
      return stream;
    } catch (err) {
      console.error("Could not access camera/mic:", err);
      alert("Could not access video/audio device. Is it already in use?");
      return null;
    }
  };

  // 👥 User joined
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  // 📞 Call user
  const handleCallUserButton = useCallback(async () => {
    const stream = await getMediaStream();
    if (!stream) return;

    stream.getTracks().forEach(track => {
      Peer.peer.addTrack(track, stream);
    });

    const offer = await Peer.getOffer();
    console.log("Offer created:", offer);

    socket.emit('user:call', { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  // 📲 Receive incoming call
  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);

    const stream = await getMediaStream();
    if (!stream) return;

    stream.getTracks().forEach(track => {
      Peer.peer.addTrack(track, stream);
    });

    const ans = await Peer.getAnswer(offer);
    console.log("Answer created for incoming call:", ans);

    socket.emit('call:accepted', { to: from, ans });
  }, [socket]);

  // 🛠 When other user accepts the call
  const handleCallAccepted = useCallback(async ({ from, ans }) => {
    await Peer.setLocalDescription(ans);
    console.log("Call accepted by", from);
  }, []);

  // ❄️ Send offer on negotiationneeded
  const handleNegoNeeded = useCallback(async () => {
    const offer = await Peer.getOffer();
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  // 🔁 Handle incoming negotiation offer
  const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    const ans = await Peer.getAnswer(offer);
    socket.emit('peer:nego:done', { to: from, ans });
  }, [socket]);

  // ✅ Final negotiation answer set
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  // 🎥 Setup incoming media track
  useEffect(() => {
    Peer.peer.addEventListener('track', async ev => {
      const [stream] = ev.streams;
      console.log("Received remote stream");
      setRemoteStream(stream);
    });
  }, []);

  // 🔄 Attach stream to video element when available
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // 📞 Setup signaling event listeners
  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on('incomming:call', handleIncommingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('peer:nego:needed', handleNegoNeedIncomming);
    socket.on('peer:nego:final', handleNegoNeedFinal);

    return () => {
      socket.off('user:joined', handleUserJoined);
      socket.off('incomming:call', handleIncommingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('peer:nego:needed', handleNegoNeedIncomming);
      socket.off('peer:nego:final', handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // 🔌 Handle negotiationneeded event
  useEffect(() => {
    Peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      Peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // 🧹 Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [myStream, remoteStream]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No One in Room"}</h4>

      {remoteSocketId && <button onClick={handleCallUserButton}>CALL</button>}

      {myStream && (
        <>
          <h3>My Stream</h3>
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            width="200"
            height="150"
            style={{ border: '1px solid gray' }}
          />
        </>
      )}

      {remoteStream && (
        <>
          <h3>Remote Stream</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            width="200"
            height="150"
            style={{ border: '1px solid gray' }}
          />
        </>
      )}
    </div>
  );
};

export default Room;
