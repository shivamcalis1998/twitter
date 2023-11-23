const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const USERNAME = process.env.MONGO_USERNAME;

const PASSWORD = process.env.MONGO_PASSWORD;

const connectMongo = mongoose.connect(
  `mongodb://${USERNAME}:${PASSWORD}@ac-i91sr3h-shard-00-00.h3muk5r.mongodb.net:27017,ac-i91sr3h-shard-00-01.h3muk5r.mongodb.net:27017,ac-i91sr3h-shard-00-02.h3muk5r.mongodb.net:27017/?ssl=true&replicaSet=atlas-10h07e-shard-0&authSource=admin&retryWrites=true&w=majority`
);

module.exports = { connectMongo };
