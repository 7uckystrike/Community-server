const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email : String,
  displayName : String,
  uid : String,
  userNum : Number,
  photoURL : String,
}, { collection : "users"});

const User = mongoose.model("User", userSchema);

module.exports = { User };