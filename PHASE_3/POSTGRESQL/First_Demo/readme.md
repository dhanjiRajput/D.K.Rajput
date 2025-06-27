# Complete Master backend using Express js in One Shot ,Postgress ,Prisma ,Redis ,Nodemailer ,BullMQ

## Backend Setup :-
- npm init -y
- npm express dotenv nodemon bcryptjs jsonwebtoken express-fileupload uuid multer cors
### Prisma Setup
- npm install prisma --save-dev 
- npm i @vinejs/vine
- npx prisma
- npx prisma init

### add this url into .env file
- DATABASE_URL="postgresql://postgres:DKRajput@12345@localhost:5433/news_app?schema=public"

### now create User Model in Prisma file
model Users {
  id         Int      @id @default(autoincrement())
  name       String   @db.VarChar(191)
  email      String   @db.VarChar(191) @unique
  password   String
  profile    String?
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
}


### now run this command
- npm i @prisma/client


### this command every time whenever changes in database with different differnt name
- npx prisma migrate dev --name users_table