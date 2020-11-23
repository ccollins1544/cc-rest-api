"use strict";
var fs = require("fs");
var path = require("path");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
let scripts = {};

// Excluded because they are reserved for package.json scripts (i.e, npm run <script>)
let exclude_files = ["seedDB.js", "init.js"];

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
    let script = require(path.join(__dirname, file));
    scripts = { ...scripts, ...script };
  });

module.exports = scripts;
