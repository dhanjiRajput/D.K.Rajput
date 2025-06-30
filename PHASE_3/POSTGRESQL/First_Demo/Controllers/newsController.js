import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import prisma from "../DB/db.config.js";
import { removeImage } from "../utils/helper.js";

class NewsController {
    static async index(req, res) {
        //offset-based pagination
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 1;

        if (page <= 0) {
            page = 1;
        }
        if (limit < 1 || limit > 100) {
            limit = 10;
        }

        let skip = (page - 1) * limit;
        const news = await prisma.news.findMany({
            take: limit,
            skip: skip,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            }
        })
        let totalNews = await prisma.news.count()
        let totalPages = Math.ceil(totalNews / limit);

        return res.json({
            stattus: 200, news, metaData: {
                totalPages, currentPage: page, currentLimit: limit
            }
        })
    };

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body);
            payload.image = `/uploads/${req.file.filename}`
            payload.user_id = user.id;

            const news = await prisma.news.create({
                data: payload
            })
            return res.json({ status: 200, message: "News Create Sccessfully!.", news })
        } catch (error) {
            console.log("The Error is :", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            } else {
                return res.status(500).json({ status: 500, message: "Something Went Wrong" })
            }
        }
    };

    static async show(req, res) {
        const { id } = req.params;
        try {
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true,
                        }
                    }
                }
            })
            return res.json({ status: 200, news })
        } catch (error) {
            console.log("The Error is :", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            } else {
                return res.status(500).json({ status: 500, message: "Something Went Wrong" })
            }
        }
    };

    static async update(req, res) {
        const { id } = req.params;
        const user = req.user;
        const body = req.body;

        try {
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);

            const news = await prisma.news.findUnique({
                where: { id: Number(id) }
            });

            if (!news) {
                return res.status(404).json({ message: "News not found" });
            }

            if (user.id !== news.user_id) {
                return res.status(403).json({ message: "You are not authorized to update this content" });
            }

            // ✅ Check if image was uploaded
            if (req.file) {
                removeImage(news.image); // Remove old image
                payload.image = `/uploads/${req.file.filename}`; // Set new image path
            }

            const updateNews = await prisma.news.update({
                data: payload,
                where: { id: Number(id) }
            });

            return res.json({
                status: 200,
                message: "News updated successfully",
                updateNews
            });

        } catch (error) {
            console.log("Update error:", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
    };

    static async destroy(req, res) {
        try {
            const {id}=req.params;
            const user = req.user;

            const news = await prisma.news.findUnique({
                where: { id: Number(id) }
            });

             if (!news) {
                return res.status(404).json({ message: "News not found" });
            }

            if (user.id !== news.user_id) {
                return res.status(403).json({ message: "You are not authorized to delete this content" });
            }

            removeImage(news.image);
            const deleteNews=await prisma.news.delete({
                where:{
                    id:Number(id)
                }
            });

            return res.json({
                status: 200,
                message: "News Deleted successfully",
                deleteNews
            });
        } catch (error) {
            console.log("Update error:", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
    };
};

export default NewsController;