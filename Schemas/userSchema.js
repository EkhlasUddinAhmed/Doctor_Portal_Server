const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  newUserName: String,
  newUserEmail: String,
  newUserAdmin:Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = userSchema;
