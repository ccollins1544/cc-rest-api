// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcrypt");
// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_used_token: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.checkPassword = function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  };

  User.prototype.hashPassword = function (plainTextPassword) {
    return bcrypt.hashSync(plainTextPassword, bcrypt.genSaltSync(10));
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null,
    );
  });

  return User;
};
