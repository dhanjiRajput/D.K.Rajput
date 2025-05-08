const Joi = require('joi');
const Rental = require('../model/rental.model');
const Movie = require('../model/movie.model');
const Customer = require('../model/customer.model');


const getRental= async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
};

const createRental=async (req, res) => {
  const { error } = validateRental(req.body); 
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  await Movie.updateOne({_id:req.body.movieId},{$inc:{numberInStock:-1}});
  res.send(rental);

};

const getRentalById= async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
};

module.exports = {getRental,getRentalById,createRental};
const validateRental=(rental)=> {
    const schema = Joi.object({
      customerId: Joi.string().required(),
      movieId: Joi.string().required()
    });
    return schema.validate(rental);
};
  