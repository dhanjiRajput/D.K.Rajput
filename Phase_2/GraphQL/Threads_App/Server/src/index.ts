import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import 'dotenv/config';


async function init() {
    const app = express();
    app.use(express.json());

    const gqlServer=new ApolloServer({
        typeDefs:`
            type Query{
                hello:String
                say(name:String):String
            }
        `,
        resolvers:{
            Query:{
                hello:()=>`Hey There I m a Graphql Server....`,
                say:(_,{name}:{name:string})=>`Hey ${name}, How r u ?`
            }
        },
    });

    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is Running.." });
    });

    app.use("/graphql", express.json(), expressMiddleware(gqlServer) as unknown as express.RequestHandler);

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

init();