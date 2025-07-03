# Complete Master backend using Express js in One Shot ,Postgress ,Prisma ,Redis
## App Fetaures :-
- Signup User
- Login User
- User Authentication
- User Authorization
- Create News
- update News
- Delete News
- Pagination
- rate Limitting
- redis caching
- winston Logger

## Backend Setup :-
- npm init -y
- npm express dotenv nodemon bcryptjs jsonwebtoken express-fileupload uuid multer cors

## install Some extra npm modules for Advanced Security and for making faster
- npm i helmet express-rate-limit express-redis-cache winston nodemailer

### Prisma Setup
- npm install prisma --save-dev
- npm i @vinejs/vine
- npx prisma
- npx prisma init

### add this url into .env file
- DATABASE_URL="postgresql://postgres:DKRajput@12345@localhost:5433/news_app?schema=public"

### now create Models in Prisma file
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  // output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Users {
  id         Int      @id @default(autoincrement())
  name       String   @db.VarChar(191)
  email      String   @unique @db.VarChar(191)
  password   String
  profile    String?
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  News       News[]
}

model News {
  id         Int      @id @default(autoincrement())
  user_id    Int
  user       Users    @relation(fields: [user_id], references: [id])
  title      String   @db.VarChar(200)
  content    String
  image      String   @db.VarChar(100)
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
}



### now run this command
- npm i @prisma/client


### this command every time whenever changes in database with different differnt name
- npx prisma migrate dev --name users_table