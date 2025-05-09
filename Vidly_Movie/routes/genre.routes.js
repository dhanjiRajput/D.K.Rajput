const {Router}=require("express");
const { getGenre, genreGetById, createGenre, genreUpdate, genreDelete } = require("../Controller/genre.controller");
const validateUser = require("../middleware/validateuser");
const isAdmin = require("../middleware/isAdmin");
const genreRoutes=Router();

genreRoutes.get("/",getGenre);
genreRoutes.get("/:id",genreGetById);
genreRoutes.post("/",validateUser,createGenre);
genreRoutes.put("/:id",validateUser,genreUpdate);
genreRoutes.delete("/:id",[validateUser,isAdmin],genreDelete);

module.exports=genreRoutes;