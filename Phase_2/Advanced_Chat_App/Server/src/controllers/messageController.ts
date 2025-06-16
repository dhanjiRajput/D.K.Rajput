import cloudinary from "../lib/cloudinary";
import Message from "../models/Message";
import User from "../models/User";
import { io, userSocketMap } from "../server";

//Get All Users except the logged in User
export const getuserForSidebar=async(req:any,res:any)=>{
    try {
        const userId=req.user._id;
        const filterUsers=await User.find({_id:{$ne:userId}}).select("-password");

        //count number of messages not seen
        const unSeenMessages: { [key: string]: number } = {};
        const promises=filterUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})

            if(messages.length >0){
                unSeenMessages[user._id.toString()] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filterUsers,unSeenMessages})
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({success:false,message: error.message});
        } else {
            console.log(error);
            res.json({success:false,message: "An error occurred"});
        }
    }
};

//Get all messages for selected users
export const getMessages=async(req:any,res:any)=>{
    try {
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({$or:[
            {senderId:myId,receiverId:selectedUserId},
            {senderId:selectedUserId,receiverId:myId},
        ]});

        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});
        res.json({success:true,messages})
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({success:false,message: error.message});
        } else {
            console.log(error);
            res.json({success:false,message: "An error occurred"});
        }
    }
};

//api to mark message as seen using message id
export const markMessageAsSeen=async(req:any,res:any)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({success:false,message: error.message});
        } else {
            console.log(error);
            res.json({success:false,message: "An error occurred"});
        }
    }
};

//send message to selected user
export const sendMessage=async(req:any,res:any)=>{
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        //Emit the new message to the receiver
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success:true,newMessage});
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({success:false,message: error.message});
        } else {
            console.log(error);
            res.json({success:false,message: "An error occurred"});
        }
    }
};

export const deleteMessage = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this message" });
    }

    await Message.findByIdAndDelete(id);

    // Emit to both sender and receiver in real-time
    const senderSocketId = userSocketMap[message.senderId.toString()];
    const receiverSocketId = userSocketMap[message.receiverId.toString()];

    [senderSocketId, receiverSocketId].forEach(socketId => {
      if (socketId) {
        io.to(socketId).emit("messageDeleted", { messageId: id });
      }
    });

    res.json({ success: true, message: "Message deleted", messageId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

