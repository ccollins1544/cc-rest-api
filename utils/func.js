/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 generateKeys
 *
 ******************************************************/
/* ===============[ Libraries ]========================*/
const path = require("path");
const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");

/* ===============[ 1. FUNCTIONS ]====================*/
let Func = {
  generateKeys: function (
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
};

module.exports = Func;
