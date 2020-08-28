"use strict";
const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const exclude_files = ["connection.js"];
let db = {};

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      exclude_files.includes(file) === false
    );
  })
  .forEach(function (file) {
    // Get the model name from the file name
    const modelName = file.match(/(.*)\.js/)[1];

    const model =
      modelName.toString().charAt(0).toUpperCase() +
      modelName.toString().toLowerCase().slice(1);

    db = { ...db, [model]: require(path.join(__dirname, file)) };
  });

module.exports = db;
