const {Router}=require('express');
const { getMovie, getMovieById, createMovie, deleteMovie, updateMovie } = require('../Controller/movie.controller');
const movieRoutes=Router();

movieRoutes.get("/",getMovie);
movieRoutes.get("/:id",getMovieById);
movieRoutes.post("/",createMovie);
movieRoutes.delete("/:id",deleteMovie);
movieRoutes.put("/:id",updateMovie);

module.exports=movieRoutes;