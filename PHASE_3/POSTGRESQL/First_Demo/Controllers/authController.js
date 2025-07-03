import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from "../config/logger.js";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: { email: payload.email }
            });

            if (findUser) {
                return res.status(400).json({
                    errors: { email: "User already exists with the same Email-ID" }
                });
            }

            payload.password = await bcrypt.hash(payload.password, 10);

            const user = await prisma.users.create({ data: payload });

            return res.json({
                status: 200,
                message: "User created successfully",
                user
            });
        } catch (error) {
            logger.error("Register error: ", error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ status: 500, message: "Something went wrong" });
        }
    }

    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: { email: payload.email }
            });

            if (findUser) {
                const isPasswordCorrect = bcrypt.compareSync(payload.password, findUser.password);
                if (!isPasswordCorrect) {
                    return res.status(400).json({ errors: { email: "Invalid credentials" } });
                }

                // Issue token
                const token = jwt.sign(
                    {
                        id: findUser.id,
                        email: findUser.email,
                        name: findUser.name,
                        profile: findUser.profile
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "365d" }
                );

                return res.json({
                    status: 200,
                    message: "User logged in successfully",
                    access_token: `Bearer ${token}`
                });
            }

            return res.status(400).json({ errors: { email: "No user found with this email-id" } });
        } catch (error) {
            logger.error("Login error: ", error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ status: 500, message: "Something went wrong" });
        }
    };
}
export default AuthController;
