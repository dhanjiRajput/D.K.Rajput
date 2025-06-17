### Threads App

## NPM  Commands
    npm i init -y
    npm i typescript -D
    npm i express @types/express dotenv @types/dotenv -D
    npx tsc --init
    npm i tsc-watch -D
    npm i @apollo/server graphql

## update package.json file for automatically reload and compile the file

"scripts": {
    "start": "node build/index.js", // and then run the build/index.js file                       this will run in second step
    "dev":"tsc-watch --onSuccess \"npm start\""   // this command will watch the src folder and compile the file  this will run in first step
  },

  application run command    :-   npm run dev