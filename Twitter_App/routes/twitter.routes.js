const {Router} = require('express');
const { createTweet, getTweets, likeTweet, commentTweet, unlikeTweet, deleteComment } = require('../controllers/twitter.controller');
const requireLogin = require('../middleware/require.login');

module.exports = (io) => {
  const twitterRoutes = Router();

  twitterRoutes.post('/create',requireLogin,createTweet(io));
  twitterRoutes.get('/get',getTweets);
  twitterRoutes.post('/like/:id',requireLogin,likeTweet(io));
  twitterRoutes.post('/unlike/:id',unlikeTweet(io));
  twitterRoutes.post('/comment/:id',requireLogin,commentTweet(io));
  twitterRoutes.delete('/:tweetId/comment/:commentId',deleteComment(io));

  
  return twitterRoutes;
};