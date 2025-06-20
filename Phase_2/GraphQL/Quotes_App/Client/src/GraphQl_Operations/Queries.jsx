import { gql } from '@apollo/client';

export const Get_All_Quotes=gql`
query getAllQuotes{
        quotes{
            name
            by{
            _id
            firstName
            }
        }
    }
`;

export const Get_My_Profile=gql`
    query getMyProfile{
        user:myprofile{
            firstName
            lastName
            email
            quotes{
                _id
                name
            }
        }
    }
`

export const Get_User_By_Id=gql`
    query getUserById($userid:ID!){
        user(_id:$userid){
            _id
            firstName
            lastName
            email
            quotes{
                name
            }
        }
    }
`