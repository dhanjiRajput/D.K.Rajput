# Hotel Booking MERN App

## Tech Stack :-
- Nodejs
- ReactJs + Vite
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
- React,Javascript
- cd client
- npm install
- npm install react-router-dom
- npm i @clerk/clerk-react
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
- npm i express dotenv cors mongoose cloudinary multer svix
- npm i @clerk/express
- npm i --save-dev nodemon