/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 generateKeys
 *
 ******************************************************/
/* ===============[ Libraries ]========================*/
process.env.DOTENV_LOADED || require("dotenv").config();
const path = require("path");
const colors = require("colors");
const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");

/* ===============[ 1. FUNCTIONS ]====================*/
let Func = {
  generateKeysAndSave: function (
    privateKeyFile = "private",
    publicKeyFile = "public",
  ) {
    privateKeyFile += ".pem";
    publicKeyFile += ".pem";

    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "",
      },
    });

    writeFileSync(path.resolve(__dirname, "../" + privateKeyFile), privateKey);
    writeFileSync(path.resolve(__dirname, "../" + publicKeyFile), publicKey);
  },

  generateKeys: () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "",
      },
    });

    return {
      private_key: privateKey,
      public_key: publicKey,
    };
  },

  seed_demo_user: () => {
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

    console.log(
      `Creating demo user ${demo_user} with password ${demo_password}`,
    );

    let values = {
      email: demo_user,
      password: demo_password,
    };

    let condition = { email: demo_user };

    try {
      const userController = require("../controllers/user");

      userController
        .insert(values, condition)
        .then((response) => {
          if (response) {
            console.log("Successfully inserted demo user!".green);
          } else {
            console.log("Already in database!".green);
          }
        })
        .catch((err) => {
          console.log("Failed!".red);
          console.log(err);
        });
    } catch (err) {
      console.log("Failed!".red);
      console.log(err);
    }
  },
};

module.exports = Func;
