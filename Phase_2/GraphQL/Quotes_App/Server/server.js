import {ApolloServer} from 'apollo-server-express';
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'
import typeDefs from './typeDefs.js';
import mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import express from 'express';
import http from 'http'

const port=process.env.PORT || 4000

const app=express();
const httpServer=http.createServer(app);

if(process.env.NODE_ENV !== "production"){
    dotenv.config();
}
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected",()=>{
    console.log("Connected to MongoDb");
});

mongoose.connection.on("error",(err)=>{
    console.log("Error Connecting to Databse",err); 
});

//protect router middleware
const context = ({req})=>{
    const {authorization}=req.headers
    if(authorization){
        const {userId}=jwt.verify(authorization,process.env.jwt_key)
        return {userId}
    }
}

//Import Model
import resolvers from './resolvers.js'

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins:[
        ApolloServerPluginDrainHttpServer({httpServer}),
        process.env.NODE_ENV!=="production" 
        ? ApolloServerPluginLandingPageGraphQLPlayground()
        : ApolloServerPluginLandingPageDisabled
    ]
})

app.get('*',(req,res)=>{
    res.send("Welcome to the Quotes App")
})

await server.start();
server.applyMiddleware({
    app,
    path:'/graphql'
});

httpServer.listen({port},()=>{
    console.log(`Server Ready at 4000 ${server.graphqlPath}`);
})