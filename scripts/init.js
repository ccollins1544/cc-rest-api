process.env.DOTENV_LOADED || require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const path = require("path");
const colors = require("colors");
const fs = require("fs");
const utils = require("../utils");

/**
 * init
 * Will set up and configure the following
 * - Database
 * - jsonwebtoken
 */

const init = async () => {
  let exit_code = 1;
  let counter = 0;

  // =====================[ Database ]===========================================
  // Config for Database
  if (!fs.existsSync(path.resolve(__dirname, "../config/config.json")) || !utils.deepEqual(require("../config"), require("../config/config.json"))) {
    console.log("===============[ Generate config for database ]===================".yellow);
    await utils.generateConfig();
    counter++;
  }

  // =====================[ jsonwebtoken ]===========================================
  // Keys for jsonwebtoken
  if (!fs.existsSync(path.resolve(__dirname, "../public.pem")) || !fs.existsSync(path.resolve(__dirname, "../private.pem"))) {
    console.log("===============[ Generate Keys for Auth ]=========================".yellow);
    await utils.generateKeysAndSave();
    counter++;
  }

  if (counter >= 0) {
    exit_code = 0;
  }

  console.log(`_______________ ${counter} init commands ran ______________________________`.green);
  process.exit(exit_code);
}

init();
