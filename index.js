const express = require("express");
const { connectMongo } = require("./database/database.js");
const { AuthModal } = require("./modal/auth.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { TweetModal } = require("./modal/tweet.js");
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password, country } = req.body;

  const userExist = await AuthModal.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User already here, logIn again." });
  }

  const user = new AuthModal({ name, email, password, country });

  await user.save();
  res.status(200).json({ message: "registration of user successfully done!" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthModal.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "user isn't exist" });
  }

  if (password === user.password) {
    const token = jwt.sign({ user: user._id }, TOKEN_SECRET);
    res.status(200).json({ message: "Login successful.", token });
  } else {
    res.status(400).json({ message: "Wrong Password" });
  }
});

app.post("/tweets", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "authorization-Invalid - please provide token" });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);

    if (decoded) {
      return res.status(401).json({ error: "authorization-Invalid" });
    }

    const user = decoded.user;
    const newOne = { ...req.body, user };
    const Tweet = await TweetModal.create(newOne);
    res.status(201).json(Tweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/tweets", async (req, res) => {
  try {
    const category = req.query.category;

    const tweets = category
      ? await TweetModal.find({ category: category })
      : await TweetModal.find();

    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/tweets/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "authorization-Invalid - please provided token" });
    }

    const exist = jwt.verify(token, TOKEN_SECRET);

    if (exist) {
      return res.status(401).json({ error: "authorization-Invalid" });
    }
    const existingTweet = await TweetModal.findById(req.params.id);
    const user = exist.user;

    if (existingTweet.user.toString() !== user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await TweetModal.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ message: "updation of Tweet successfully done!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/tweets/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "authorization-Invalid - please provided token" });
    }

    const exists = jwt.verify(token, TOKEN_SECRET);

    if (exists) {
      return res.status(401).json({ error: "authorization-Invalid" });
    }
    const existingTweet = await TweetModal.findById(req.params.id);
    const user = exists.user;

    if (existingTweet.user.toString() !== user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await TweetModal.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "deletion of tweet deleted successfully done!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8001, async () => {
  await connectMongo;
  console.log(`Server is running on port ${8001}`);
});
