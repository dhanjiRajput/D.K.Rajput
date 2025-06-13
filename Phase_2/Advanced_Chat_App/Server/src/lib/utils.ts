import jwt from 'jsonwebtoken';
import "dotenv/config";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Interface type for payload
interface JwtPayload {
    userId: string;
}

// Function to generate a token for a user
export const generateToken = (userId: string): string => {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
    }
    const token = jwt.sign({ userId } as JwtPayload, JWT_SECRET_KEY);
    return token;
};