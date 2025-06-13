import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";
import menu from "../assets/menu.png";
import search from "../assets/search.png";
// import { dummyUsers } from "../assets/dummyUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


const SideBar= () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);

  if (!auth) throw new Error("AuthContext is undefined. Make sure your app is wrapped with AuthProvider.");
  if (!chat) throw new Error("ChatContext is undefined. Make sure your app is wrapped with ChatProvider.");

  const {logout,onlineUsers} = auth;
  const {getUsers,users,selectedUser,setSelectedUser,unseenMessages}= chat;

  const [input, setInput] = useState<string>("");

  const filteredUsers = input ? users.filter((user) =>user.fullName.toLowerCase().includes(input.toLowerCase())):users;

  useEffect(() => {
    getUsers();
  },[onlineUsers]);
  
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-l-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center text-lg">
            <img src={logo} alt="logo" className="max-w-20" />
            My_Chat_App
          </div>
          <div className="relative py-2 group">
            <img src={menu} alt="menu" className="max-h-5 cursor-pointer" />
            <div className="absolute top-full right-0 z-0 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm">Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout && logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={search} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {setSelectedUser(user)}}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user.id ? "bg-[#282142]/50" : ""}`}
          >
            <img src={user?.profilePic||avatar} alt={user.fullName} className="w-12 h-12 rounded-full" />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {
                onlineUsers?.includes(user._id) 
                ? <span className="text-green-400 text-xs">Online</span>
                : <span className="text-neutral-400 text-xs">Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && 
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
