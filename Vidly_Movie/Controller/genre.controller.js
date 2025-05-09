const asyncMiddleware = require("../middleware/async");
const Genre= require("../model/genre.model");
const Joi=require("joi");

const getGenre=asyncMiddleware( async (req, res) => {
    const genres =await Genre.find().sort('name');
    res.send(genres);
    throw new Error('could not get genres...');
});

const createGenre= async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.message);

  let genre = await Genre.create(req.body);
  res.send(genre);
};

const genreUpdate= async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
};

const genreDelete=async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
};

const genreGetById=async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
};

const validateGenre = (genre) => {
    const schema = Joi.object({
      name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
  };
  

module.exports = {genreDelete,genreGetById,genreUpdate,getGenre,createGenre}