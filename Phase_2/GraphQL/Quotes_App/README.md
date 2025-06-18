### Quotes App using Graphql

## NPM commands
 npm init -y
 npm install @apollo/server graphql
npm install express body-parser cors
npm install @apollo/server express4
npm install @apollo/server-plugin-landing-page-graphql-playground



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
    	quotes{
        name
        by
      }
  }
}


query getAllUsers($_id:ID!){
  user(_id:$_id){
    	_id
    	firstName
    	lastName
    	quotes{
        name
        by
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