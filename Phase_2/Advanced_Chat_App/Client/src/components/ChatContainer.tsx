import profile1 from "../assets/profile1.png";
import arrow from "../assets/arrow.png";
import help from "../assets/help.png";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import gallery from "../assets/gallery.png";
import send_btn from "../assets/send.png";
import { dummyMessages } from "../assets/dummuMessage";
import React,{ useEffect, useRef } from "react";
import { formateMessageTime } from "../lib/utils";

const ChatContainer = ({ selectUser, setSelectUser }) => {

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  
  return selectUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Head Area */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={profile1} alt="" className="w-8 rounded-full"></img>
        <p className="flex-1 text-lg text-white flex items-center gap-2">D.K.Rajput
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img onClick={() => setSelectUser(null)} src={arrow} alt="" className="md:hidden max-w-7"></img>
        <img src={help} alt="" className="max-md:hidden max-w-7"></img>
      </div>
      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {dummyMessages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== 'u1' && 'flex-row-reverse'}`}>
            {msg.senderImage ? (<img src={msg.senderImage} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"></img>
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === 'u1' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )}
            <div className="text-center text-xs">
                <img src={msg.senderId==='u1'?avatar:profile1} alt="" className="w-7 rounded-full" ></img>
                <p className="text-gray-500">{formateMessageTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd} /></div>
      {/* Bottome Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 mx-3 border-t border-stone-500">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
              <input type="text" placeholder="Send A Message" className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"></input>
              <input type="file" id="image" accept="image/png , image/jpeg" hidden></input>
              <label htmlFor="image">
                  <img src={gallery} alt="Click To Add Image" className="w-8 mr-2 cursor-pointer"></img>
              </label>
          </div>
          <img src={send_btn} alt="" className="w-8 cursor-pointer"></img>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={logo} className="max-w-50" alt=""></img>
      <p className="text-lg font-medium text-white">Chat Anytime, AnyWhere..</p>
    </div>
  )
}

export default ChatContainer