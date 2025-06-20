import { gql } from "@apollo/client";

export const Signup_User=gql`
mutation Signup($signup_User: signup_user_input!) {
  signupUser(signup_User: $signup_User) {
    firstName
  }
}
`

export const Login_User=gql`
mutation Login($signin_User:signin_user_input!){
  	user:signinUser(signin_User:$signin_User){
    token
  }
}
`

export const Create_Quote=gql`
    mutation createQuotes($name:String!){
  	createQuote(name:$name)
}
`

export const Update_Quote = gql`
  mutation updateQuote($_id: ID!, $name: String!) {
    updateQuote(_id: $_id, name: $name)
  }
`;

export const Delete_Quote = gql`
  mutation deleteQuote($_id: ID!) {
    deleteQuote(_id: $_id)
  }
`;