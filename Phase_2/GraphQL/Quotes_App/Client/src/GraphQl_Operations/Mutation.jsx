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