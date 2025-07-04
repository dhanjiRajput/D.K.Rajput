# Hotel Booking MERN App

## Tech Stack :-
- Nodejs + TypeScript
- ReactJs + TypeScript + Vite
- MongoDB
- Express js
- tailwind css


## App Features :-
- Signup User
- Login User
- User Authentication
- User Authorization

===================================================================================================
## Frontend Setup :-
- npm create vite@latest
- client
- React,Typescript
- cd client
- npm install
- npm install react-router-dom
- npm install -D @types/react-router-dom
- To run Frontend Project :-  npm run dev

### tailwind setup :-
- npm install tailwindcss @tailwindcss/vite

###  Configure Tailwind CSS - Update `vite.config.ts`:
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
     plugins: [react(), tailwindcss()],
});

### Add Tailwind directives to `src/index.css`:
   @import "tailwindcss";

### For Navbar,Form used Prebuiltui.com site
- https://prebuiltui.com/components

### For Authentication UI component
- https://clerk.com/docs/quickstarts/react?utm_source=greatstack&utm_medium=youtube&utm_campaign=hotel-booking-app&dub_id=XC5BglMWlVDAPBuf

### .env Setup for clerk key
- VITE_CLERK_PUBLISHABLE_KEY=pk_test_YXJ0aXN0aWMtcXVldHphbC00NC5jbGVyay5hY2NvdW50cy5kZXYk

================================================================================================
## Backend Setup :-
- npm init -y
- npm install express
- npm install -D typescript ts-node-dev @types/node @types/express
- npx tsc --init
- npm install -D concurrently
- To Run Project :- npm run dev:start



### TsConfig file :-
{
  "compilerOptions": {
    "target": "ES2020",                     
    "module": "commonjs",                  
    "outDir": "./dist",                    
    "rootDir": "./src",                    
    "strict": true,                        
    "esModuleInterop": true,               
    "skipLibCheck": true,                  
    "forceConsistentCasingInFileNames": true
  }
}


### script in package.json file setup
"scripts": {
  // Run app with auto-restart, fast transpile (no type check)
  "dev": "ts-node-dev --respawn --clear --transpile-only src/app.ts",

  // Watch and compile TypeScript to dist/
  "tsc:watch": "tsc --watch",

  // Run dev server and compiler together
  "start:dev": "concurrently \"npm run dev\" \"npm run tsc:watch\"",

  // Build TypeScript once into dist/
  "build": "tsc",

  // Run compiled app from dist/ (production)
  "start": "node dist/app.js"
}