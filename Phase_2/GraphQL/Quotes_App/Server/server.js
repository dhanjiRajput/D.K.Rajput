import {ApolloServer} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from '@apollo/server-plugin-landing-page-graphql-playground'
import typeDefs from './typeDefs.js';
import mongoose  from 'mongoose';
import { jwt_key, MONGO_URI } from './config.js';
import jwt from 'jsonwebtoken';

mongoose.connect(MONGO_URI);

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
        const {userId}=jwt.verify(authorization,jwt_key)
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
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({url})=>{
    console.log(`Server Ready at ${url}`);
})