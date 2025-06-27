import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema)
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })
            if (findUser) {
                return res.status(400).json({ errors: { email: "User Already exist with the Same Email-Id" } });
            }

            payload.password = await bcrypt.hash(payload.password, 10);

            const user = await prisma.users.create({
                data: payload
            })
            return res.json({ status: 200, message: "User Created Successfully", user });
        } catch (error) {
            console.log("The Error is :", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            } else {
                return res.status(500).json({ status: 500, message: "Something Went Wrong" })
            }
        }
    };


    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema)
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })
            if (findUser) {
                if(!bcrypt.compareSync(payload.password,findUser.password)){
                    return res.status(400).json({ errors: { email: "Invalid credentials" } });
                }
                //Issue token
                const token=jwt.sign({
                    id:findUser.id,
                    email:findUser.email,
                    name:findUser.name,
                    profile:findUser.profile
                },process.env.JWT_SECRET,{
                    expiresIn:"365d"
                })
                return res.json({ status: 200, message: "User Logged in Successfully",access_token:`Bearer ${token}`});
            }
            return res.status(400).json({ errors: { email: "No User Found with this email-id" }});
        } catch (error) {
            console.log("The Error is :", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            } else {
                return res.status(500).json({ status: 500, message: "Something Went Wrong" })
            }
        }
    }
}

export default AuthController;