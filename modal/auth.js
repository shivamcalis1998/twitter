const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
});
// mera desh badal rha hai
const AuthModal = mongoose.model("user", authSchema);

module.exports = { AuthModal };
