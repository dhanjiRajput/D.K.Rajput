import { useContext, useEffect, useState } from "react";
import avatar from "../assets/avatar.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const RightSideBar = () => {
  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);

  if (!auth) throw new Error("AuthContext is undefined. Make sure your app is wrapped with AuthProvider.");
  if (!chat) throw new Error("ChatContext is undefined. Make sure your app is wrapped with ChatProvider.");

  const { logout, onlineUsers } = auth;
  const { selectedUser, messages } = chat;

  const [msgImages, setMsgImages] = useState<string[]>([]);

  useEffect(() => {
    setMsgImages(
      messages
        .filter(msg => msg.image)
        .map(msg => msg.image!)
        .filter((img): img is string => Boolean(img))
    );
  }, [messages]);

  return (
    selectedUser && (
      <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser.profilePic || avatar}
            alt="Selected user avatar"
            className="w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers?.includes(selectedUser._id) && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
            {selectedUser.fullName}
          </h1>
          <p className="text-center px-4 mx-auto">{selectedUser.bio || "No bio available"}</p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[400px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className="cursor-pointer rounded">
                <img src={url} alt="Media" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => logout && logout()}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-lg font-bold py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSideBar;
