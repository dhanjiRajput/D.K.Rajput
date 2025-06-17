### npm commands :-

npm init -y
npm i express body-parser cors axios @types/axios
npm i @apollo/server graphql

graphql Postman query

query ExampleQuery {
  getTodos{
    title
    completed
    user{
        name
        email
        phone
    }
  }
}

