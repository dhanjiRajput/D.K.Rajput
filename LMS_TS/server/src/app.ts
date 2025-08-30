require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import e from "express";


//body parser
app.use(express.json({limit: "50mb"}));

//cookie parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN,
}));


//Testing API
app.get("/test", (req: Request, res: Response,next: NextFunction) => {
  res.status(200).json({success: true, message: "🚀 Hello, TypeScript + Express Server is running!" });
});

// Catch-all for unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
  err.statusCode = 404;
  next(err);
});