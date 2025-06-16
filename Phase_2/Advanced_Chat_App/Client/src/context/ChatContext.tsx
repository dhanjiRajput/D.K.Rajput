import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

// -------------------- Types --------------------
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  createdAt?: string;
}

interface User {
  _id: string;
  fullName: string;
  email?: string;
  profilePic?: string;
  [key: string]: any;
}

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  sendMessage: (messageData: { text?: string; image?: string }) => void;
  deleteMessage: (messageId: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  unseenMessages: { [userId: string]: number };
  setUnseenMessages: React.Dispatch<React.SetStateAction<{ [userId: string]: number }>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<{ [userId: string]: number }>({});

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");

  const { socket, axios, authUser } = authContext;

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
    }
  };

  const getMessages = async (userId: string) => {
    try {
      const { data } = await axios.get(`/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (messageData: { text?: string; image?: string }) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(`/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { data } = await axios.delete(`/messages/delete/${messageId}`);
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        toast.success("Message deleted");
      }
    } catch (error: any) {
      toast.error("Error deleting message");
      console.error("Delete Error:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;

    // New message
    socket.on("newMessage", (newMessage: Message) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseen) => ({
          ...prevUnseen,
          [newMessage.senderId]: (prevUnseen[newMessage.senderId] || 0) + 1,
        }));
      }
    });

    // ✅ Real-time message deletion
    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("messageDeleted");
    }
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser]);

  const value: ChatContextType = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    deleteMessage,
    setMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
