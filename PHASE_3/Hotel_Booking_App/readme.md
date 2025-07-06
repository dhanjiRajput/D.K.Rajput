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
- npm install -g typescript
- npx tsc --init
- npm i express
- npm i --save-dev nodemon
- npm install express cors dotenv mongoose multer cloudinary svix
- npm install -D @types/express @types/cors @types/multer @types/node
- npm install @clerk/express

## To run program in two terminal
- tsc -w // this is for typescript compilation
- npm run dev  // this will run javascript file