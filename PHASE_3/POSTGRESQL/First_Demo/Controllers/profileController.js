import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import logger from "../config/logger.js";


class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.json({ status: 200, user });
        } catch (error) {
            logger.error("Profile fetch failed: " + error.message);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    static async store() {
        // Not implemented yet
    }

    static async show() {
        // Not implemented yet
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            await prisma.users.update({
                data: {
                    profile: `/uploads/${req.file.filename}`,
                },
                where: {
                    id: Number(id)
                }
            });
            return res.json({ status: 200, message: "Profile Image Updated successfully" });
        } catch (error) {
            logger.error("Profile update failed: " + error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    static async destroy() {
        // Not implemented yet
    }
}

export default ProfileController;