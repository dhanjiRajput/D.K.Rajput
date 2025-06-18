import { quotes, users } from './fakedb.js';
import {randomBytes} from 'crypto';
import './models/user.model.js'
import bcrypt from 'bcryptjs'
import User from './models/user.model.js';
import jwt from 'jsonwebtoken';
import { jwt_key } from './config.js';
import Quote from './models/quotes.model.js';

const resolvers={
    // User:{
    //     quotes:(ur)=>quotes.filter(qu=>qu.by==ur._id)
    // },

    // Query:{
    //     users:()=>users,
    //     user:(_,{_id})=>users.find(user=>user._id==_id),
    //     quotes:()=>quotes
    // },

    Mutation:{
        //Create New User
        signupUser:async(_,{signup_User})=>{
            const user=await User.findOne({email:signup_User.email});
            if(user){
                throw new Error("User Already Exist... ")
            }

            const hashedPassword=await bcrypt.hash(signup_User.password,10);

            const newuser=await User.create({
                ...signup_User,
                password:hashedPassword
            });
            return await newuser.save();
        },

        //Login existing User(Authentication)
        signinUser:async(_,{signin_User})=>{
            const user=await User.findOne({email:signin_User.email});
            if(!user){
                throw new Error("User Not Found... ");
            }

            const matchedPassword=await bcrypt.compare(signin_User.password,user.password);
            if(!matchedPassword){
                throw new Error("Invalid Password....");
            }

            const token=jwt.sign({userId:user._id},jwt_key);
            return {token}
        },


        //Create New Quotes
        createQuote:async(_,{name},{userId})=>{
            if(!userId){
                throw new Error("You Must Logged in");
            }

            const quote=await Quote.create({
                name,
                by:userId
            });

            await quote.save();
            return "Quote Created Sucessfully"
        }
    }
};

export default resolvers;