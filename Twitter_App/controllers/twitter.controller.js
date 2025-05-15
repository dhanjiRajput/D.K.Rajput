const Tweet = require("../models/twitter.model");

const createTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.create({
      content: req.body.content,
      author: req.session.userId,
    });

    const populated = await Tweet.findById(tweet._id).populate('author', 'username');
    io.emit('newTweet', populated);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('comments.user', 'username');
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.session.userId)) {
      tweet.likes.push(req.session.userId);
      await tweet.save();
    }
    const updated = await Tweet.findById(tweet._id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    io.emit('tweet_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikeTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    // Remove userId from likes array if exists
    tweet.likes = tweet.likes.filter(userId => userId.toString() !== req.session.userId);
    await tweet.save();

    const updated = await Tweet.findById(tweet._id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    io.emit('tweet_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const commentTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    tweet.comments.push({ user: req.session.userId, text: req.body.text });
    await tweet.save();

    const updated = await Tweet.findById(tweet._id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    io.emit('tweet_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    // Remove comment with matching commentId from comments array
    tweet.comments = tweet.comments.filter(comment => comment._id.toString() !== req.params.commentId);
    await tweet.save();

    const updated = await Tweet.findById(tweet._id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    io.emit('tweet_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTweet,
  getTweets,
  likeTweet,
  unlikeTweet,
  commentTweet,
  deleteComment,
};