import { gql } from 'apollo-server-core';

const typeDefs=gql`
    type User{
        _id:ID!
        firstName:String!
        lastName:String!
        email:String!
        quotes:[Quote]
    }

    type Quote{
        name:String!
        by:String!
    }

    type Query{
        users:[User]
        user(_id:ID!):User
        quotes:[QuoteWithName]
        iquote(by:ID!):[Quote]
        myprofile:User
    }

    type IdName{
        _id:String
        firstName:String
    }

    type QuoteWithName{
        name:String
        by:IdName
    }

    input signup_user_input{
        firstName:String!
        lastName:String!
        email:String!
        password:String!
    }

    type Token{
        token:String!
    }

    input signin_user_input{
        email:String!
        password:String!
    }

    type Mutation{
        signupUser(signup_User:signup_user_input!):User
        signinUser(signin_User:signin_user_input!):Token

        createQuote(name:String!):String
    }
`;

export default typeDefs;