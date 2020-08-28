const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.promise = Promise;

// Define userSchema
const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    last_used_token: { type: String, unique: false, required: false },
  },
  {
    timestamps: true,
  },
);

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, 10);
  },
};

// Define pre hooks for the save method
userSchema.pre("save", function (next) {
  if (!this.password) {
    console.log("models/user.js =======NO PASSWORD PROVIDED=======");
    next();
  } else {
    console.log("models/user.js hashPassword in pre save");

    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
