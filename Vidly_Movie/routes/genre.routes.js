const {Router}=require("express");
const { getGenre, genreGetById, createGenre, genreUpdate, genreDelete } = require("../Controller/genre.controller");
const genreRoutes=Router();

genreRoutes.get("/",getGenre);
genreRoutes.get("/:id",genreGetById);
genreRoutes.post("/",createGenre);
genreRoutes.put("/:id",genreUpdate);
genreRoutes.delete("/:id",genreDelete);

module.exports=genreRoutes;