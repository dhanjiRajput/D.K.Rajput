import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";

class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.json({ status: 200, user })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' })
        }
    };

    static async store() {

    };

    static async show() {

    };

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
            })
            return res.json({ status: 200, message: "Profile Image Updated successfully" });
        } catch (error) {
            return res.status(500).json({message:"Something went wrong"})
        }
    };

    static async destroy() {

    };
};

export default ProfileController;