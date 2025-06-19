### Quotes App using Graphql

## NPM commands
 npm init -y
 npm install @apollo/server graphql
npm install express body-parser cors
npm install @apollo/server express4
npm install @apollo/server-plugin-landing-page-graphql-playground
npm i @apollo/client

client : npm run dev
server : nodemon

App Fetaures :-
- Login and Signup
- Authentication and Authorization
- Logged user can Create Quote
- Logged user only can see profile
- unLogged user can see only normal profile
- logout the app
- Logged user can delete the quoate
- Logged user can update theri quoates

//herer All Queries and mutation which i have used in app
query getAllUsers{
  users{
    	_id
    	firstName
    	lastName
  }
}


query getAllUsers{
  users{
    	_id
    	firstName
    	lastName
  }
  quotes{
    	name
    by
  }
}



query getAllUsers{
  users{
    _id
    firstName
    lastName
    email
    quotes{
      name
      by
    }
  }
}


query getUserById($_id:ID!){
  user(_id:$_id){
    	_id
    	firstName
    	lastName
      email
    	quotes{
        name
        by
      }
  }
}

// Populated Query
query getAllQuotes{
  quotes{
    name
    by{
      _id
      firstName
    }
  }
}

//Create User
mutation createNewUSer($newUser:userInput!){
  	user:signupUserDummy(newUser:$newUser){
    _id
    firstName
    lastName 
  }
}

variable Name
{
  "newUser": {
    "firstName":"R.D",
    "lastName":"Rajput",
    "email":"rd@gmail.com",
    "password":"rd"
  }
}


//login user
mutation signinUser($signin_User:signin_user_input!){
  	user:signinUser(signin_User:$signin_User){
    token
  }
}

// variable name

{
  "signin_User": {
    "email":"dr@gmail.com",
    "password":"rd"
  }
}