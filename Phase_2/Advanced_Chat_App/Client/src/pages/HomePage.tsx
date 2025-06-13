import { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import SideBar from "../components/SideBar";

// Define User interface here or import it from a shared types file
interface User {
  id: string;
  _id?: string;
  fullName: string;
  profilePic: string;
  // other optional fields like `bio` if needed
}

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative
        ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <SideBar/>
        <ChatContainer/>
        <RightSideBar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
