import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User';
import { NextFunction } from 'express';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Middleware to Protect Routes
export const protectRoutes = async (req: any, res: any, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        console.log("Token from cookies:", token);
        // If token is not present in cookies, return unauthorized
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        if (!JWT_SECRET_KEY) {
            throw new Error("JWT secret key is not defined");
        }
        const decode = jwt.verify(token, JWT_SECRET_KEY as string) as { userId: string };
        const user = await User.findById(decode.userId).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "User Not Found...." });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({ success: false, message: error.message });
        } else {
            console.log(error);
            res.json({ success: false, message: "An error occurred" });
        }
    }
};