const Tweet = require("../models/twitter.model");

// Helper to get a fully populated tweet
const getPopulatedTweet = async (tweetId) => {
  return Tweet.findById(tweetId)
    .populate("author", "username")
    .populate("comments.user", "username");
};

const createTweet = (io) => async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const tweet = await Tweet.create({
      content: req.body.content,
      author: req.session.userId,
      photo: photoPath,
    });

    const populated = await getPopulatedTweet(tweet._id);
    io.emit("newTweet", populated);
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating tweet:", err);
    res.status(500).json({ message: "Failed to create tweet", error: err.message });
  }
};

const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("comments.user", "username");

    res.json(tweets);
  } catch (err) {
    console.error("Error fetching tweets:", err);
    res.status(500).json({ message: "Failed to fetch tweets", error: err.message });
  }
};

const likeTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (!tweet.likes.includes(req.session.userId)) {
      tweet.likes.push(req.session.userId);
      await tweet.save();
    }

    const updated = await getPopulatedTweet(tweet._id);
    io.emit("tweet_updated", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error liking tweet:", err);
    res.status(500).json({ message: "Failed to like tweet", error: err.message });
  }
};

const unlikeTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.likes = tweet.likes.filter(
      (id) => id.toString() !== req.session.userId
    );
    await tweet.save();

    const updated = await getPopulatedTweet(tweet._id);
    io.emit("tweet_updated", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error unliking tweet:", err);
    res.status(500).json({ message: "Failed to unlike tweet", error: err.message });
  }
};

const commentTweet = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.comments.push({
      user: req.session.userId,
      text: req.body.text,
    });
    await tweet.save();

    const updated = await getPopulatedTweet(tweet._id);
    io.emit("tweet_updated", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error commenting on tweet:", err);
    res.status(500).json({ message: "Failed to comment", error: err.message });
  }
};

const deleteComment = (io) => async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.comments = tweet.comments.filter(
      (comment) =>
        comment._id.toString() !== req.params.commentId ||
        comment.user.toString() !== req.session.userId
    );
    await tweet.save();

    const updated = await getPopulatedTweet(tweet._id);
    io.emit("tweet_updated", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
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