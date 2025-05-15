const { Router } = require('express');
const userRoutes = require('./user.routes');
const twitterRoutes = require('./twitter.routes');


module.exports = (io) => {
  const indexRoutes = Router();

  indexRoutes.use('/users', userRoutes);
  indexRoutes.use('/tweets', twitterRoutes(io));

  return indexRoutes;
};
