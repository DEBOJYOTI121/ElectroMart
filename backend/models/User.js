const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  mobile: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  wishlist: {
    type: [Number],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Users", UserSchema);