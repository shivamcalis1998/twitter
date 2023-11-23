const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: {
    type: String,
    enum: ["education", "development", "fun", "sports"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const TweetModal = mongoose.model("tweet", tweetSchema);

module.exports = { TweetModal };
