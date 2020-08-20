process.env.DOTENV_LOADED || require("dotenv").config();
const colors = require("colors");

const seed_demo_user = async () => {
  let demo_user = process.env.DEMO_USER;
  let demo_password = process.env.DEMO_PASSWORD;

  if (demo_user === undefined || demo_password === undefined) {
    console.log(
      "Not creating demo user because no demo USERNAME and PASSWORD was defined in .env",
    );
    return;
  }

  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(demo_user.trim()) ===
    false
  ) {
    demo_user = demo_user.trim() + "@" + demo_user.trim() + ".com";
  }

  console.log(`Creating demo user ${demo_user} with password ${demo_password}`);

  let values = {
    email: demo_user,
    password: demo_password,
  };

  let condition = { email: demo_user };

  try {
    const userController = require("../controllers/user");

    await userController
      .insert(values, condition)
      .then((response) => {
        if (response) {
          console.log("Successfully inserted demo user!".green);
          return 0;
        } else {
          console.log(demo_user + " Already in database!".green);
          return 1;
        }
      })
      .catch((err) => {
        console.log("Failed!".red);
        console.log(err);
        return 1;
      });
  } catch (err) {
    console.log("Failed!".red);
    console.log(err);
    return 1;
  }
};

module.exports = seed_demo_user;
