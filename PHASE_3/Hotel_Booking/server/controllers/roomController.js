import Hotel from "../models/hotelModel.js";
import {v2 as cloudinary} from 'cloudinary';
import Room from "../models/roomModel.js";

// API to Create a new Room for a hotel
export const createRoom=async(req,res)=>{
    try {
        const {roomType,amenities,pricePerNight}=req.body;
        const hotel=await Hotel.findOne({owner:req.auth.userId});
        if(!hotel) return res.json({success:false,message:"No Hotel Found.."});
        
        //upload images to cloudinary
        const uploadImages=req.files.map(async(file)=>{
            const response=await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        //wait for All uploads to complete
        const images=await Promise.all(uploadImages);

        await Room.create({
            hotel:hotel._id,
            roomType,
            pricePerNight:+pricePerNight,
            amenities:JSON.parse(amenities),
            images,
        })

        res.json({success:true,message:"Room Create Successfully"});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
};


// API to get all Rooms
export const getRooms=async(req,res)=>{
    try {
        const rooms=await Room.find({isAvailable:true}).populate(
            {
                path:'hotel',
                populate:{
                    path:'owner',
                    select:'image',
                }
            }).sort({createdAt:-1})

            res.json({success:true,rooms});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
};

// API to get all Rooms for a specific hotel
export const getOwnerRooms=async(req,res)=>{
    try {
        const hotelData=await Hotel.findOne({owner:req.auth.userId});
        const rooms=await Room.find({hotel:hotelData._id.toString()}).populate('hotel');
        res.json({success:true,rooms});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
};


// API to toggle Availability of a room
export const toggleRoomAvailability=async(req,res)=>{
    try {
        const {roomId}=req.body;
        const roomData=await Room.findById(roomId);
        roomData.isAvailable=!roomData.isAvailable;
        await roomData.save();
        res.json({success:true,message:"Room Availability Updated.."});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
};