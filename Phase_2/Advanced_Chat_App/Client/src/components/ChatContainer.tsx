import arrow from "../assets/arrow.png";
import help from "../assets/help.png";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import gallery from "../assets/gallery.png";
import send_btn from "../assets/send.png";
import delete_icon from "../assets/delete.png";
import React, { useContext, useEffect, useRef, useState } from "react";
import { formateMessageTime } from "../lib/utils";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  if (!auth) throw new Error("AuthContext is undefined. Wrap your app with AuthProvider.");
  if (!chat) throw new Error("ChatContext is undefined. Wrap your app with ChatProvider.");

  const { authUser, onlineUsers } = auth;
  const { messages, sendMessage, deleteMessage, selectedUser, setSelectedUser, getMessages } = chat;

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) scrollEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (
    e: React.FormEvent | React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLImageElement>
  ) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result as string });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage(e);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await deleteMessage(messageId);
  };

  if (!authUser || !selectedUser) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={logo} className="max-w-50" alt="Logo" />
        <p className="text-lg font-medium text-white">Chat Anytime, Anywhere..</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser?.profilePic || avatar} alt="Profile" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers?.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={arrow} alt="Back" className="md:hidden max-w-7 cursor-pointer" />
        <img src={help} alt="Help" className="max-md:hidden max-w-7" />
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col h-[calc(95%-100px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`group relative flex gap-2 mb-2 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId === authUser._id && (
              <img
                src={delete_icon}
                onClick={() => handleDeleteMessage(msg._id)}
                alt="delete"
                className="w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity mt-4"
              />
            )}
            <div className={`flex items-end gap-2 ${msg.senderId !== authUser._id ? "flex-row-reverse" : ""}`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="sent"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                    msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.profilePic || avatar
                      : selectedUser?.profilePic || avatar
                  }
                  alt="avatar"
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">{formateMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollEnd} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 mx-3 border-t border-stone-500">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Send A Message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />
          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={gallery} alt="Click To Add Image" className="w-8 mr-2 cursor-pointer" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={send_btn} alt="Send" className="w-8 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatContainer;
