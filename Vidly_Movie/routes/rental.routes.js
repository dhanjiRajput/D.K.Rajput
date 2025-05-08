const {Router}=require('express');
const { getRental, getRentalById, createRental } = require('../Controller/rental.controller');
const rentalRoutes=Router();

rentalRoutes.get("/",getRental);
rentalRoutes.get("/:id",getRentalById);
rentalRoutes.post("/",createRental);

module.exports=rentalRoutes;