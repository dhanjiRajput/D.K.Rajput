import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

module.exports=(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong MongoDB ObjectId
    if (err.name === "CastError") {
        const message=`Resource not found. Invalid : ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    //Duplicate key error
    if(err.code===11000){
        const message=`Duplicate $`;
        err=new ErrorHandler(message,400);
    }
}
