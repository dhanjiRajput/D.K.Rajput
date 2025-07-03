import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import prisma from "../DB/db.config.js";
import { removeImage } from "../utils/helper.js";
import redisCache from "../utils/redisClient.js";
import logger from "../config/logger.js";


class NewsController {
    static async index(req, res) {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        if (page <= 0) page = 1;
        if (limit < 1 || limit > 100) limit = 10;

        let skip = (page - 1) * limit;

        try {
            const news = await prisma.news.findMany({
                take: limit,
                skip,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true,
                        }
                    }
                }
            });

            const totalNews = await prisma.news.count();
            const totalPages = Math.ceil(totalNews / limit);

            return res.json({
                stattus: 200,
                news,
                metaData: { totalPages, currentPage: page, currentLimit: limit }
            });
        } catch (error) {
            logger.error("Index fetch failed: ", error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);
            payload.image = `/uploads/${req.file.filename}`;
            payload.user_id = user.id;

            redisCache.del("/api/news", (err) => {
                if (err) throw err;
            });

            const news = await prisma.news.create({ data: payload });

            return res.json({ status: 200, message: "News Create Successfully!.", news });
        } catch (error) {
            logger.error("Create error: ", error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ status: 500, message: "Something went wrong" });
        }
    }

    static async show(req, res) {
        const { id } = req.params;
        try {
            const news = await prisma.news.findUnique({
                where: { id: Number(id) },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true,
                        }
                    }
                }
            });
            return res.json({ status: 200, news });
        } catch (error) {
            logger.error("Show error: ", error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ status: 500, message: "Something went wrong" });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const user = req.user;
        const body = req.body;

        try {
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);

            const news = await prisma.news.findUnique({ where: { id: Number(id) } });

            if (!news) return res.status(404).json({ message: "News not found" });

            if (user.id !== news.user_id) {
                return res.status(403).json({ message: "You are not authorized to update this content" });
            }

            if (req.file) {
                removeImage(news.image);
                payload.image = `/uploads/${req.file.filename}`;
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
            logger.error("Update error: ", error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;

            const news = await prisma.news.findUnique({ where: { id: Number(id) } });

            if (!news) return res.status(404).json({ message: "News not found" });

            if (user.id !== news.user_id) {
                return res.status(403).json({ message: "You are not authorized to delete this content" });
            }

            removeImage(news.image);

            const deleteNews = await prisma.news.delete({
                where: { id: Number(id) }
            });

            return res.json({
                status: 200,
                message: "News Deleted successfully",
                deleteNews
            });

        } catch (error) {
            logger.error("Delete error: " + error.message);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            }
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
}

export default NewsController;
