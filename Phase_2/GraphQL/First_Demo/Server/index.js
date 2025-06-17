const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const {ApolloServer}=require('@apollo/server');
const axios=require('axios');
const {expressMiddleware}=require('@apollo/server/express4');


async function startServer() {
    const app=express();
    app.use(bodyParser.json());
    app.use(cors());

    const server=new ApolloServer({
        typeDefs:`
            type User{
                id:ID!
                name:String!
                email:String!
                username:String!
                phone:String!
                website:String!
            }

            type Todo{
                id:ID!
                title:String!
                completed:Boolean!
                user:User
            }

            type Query{
                getTodos:[Todo]
                getAllUser:[User]
                getUser(id:ID!):User
            }
        `,
        resolvers:{
            Todo:{
                user:async(todo)=>(await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
            },
            Query:{
                getTodos:async()=>(await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUser:async()=>(await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser:async(paraent,{id})=>(await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        },
    });

    await server.start();

    app.use('/graphql',expressMiddleware(server));

    app.listen(8000,()=>{
        console.log('Server is running on port 8000');
    });
}

startServer();