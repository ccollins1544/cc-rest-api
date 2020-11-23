/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 0. Crypto Functions
 *   0.1 generateKeysAndSave
 *   0.2 generateKeys
 *   0.3 encrypt
 *   0.4 decrypt
 * 
 * 1. Helper Functions
 *   1.1 generateConfig
 *   1.2 isObject 
 *   1.3 deepEqual
 *   1.4 Array2Table
 *   1.5 humanize 
 *   1.6 dehumanize
 *   1.7 getDirectories
 *   1.8 listDirFilesByType
 *   1.9 blockingWait
 *   1.10 loopArrayObject
 *   1.11 loopObject
 *   1.12 listAll
 *
 * 2. Seed DB Functions
 *   2.1 seed_demo_user
 *   2.2 seed_employees
 *
 ******************************************************/
/* ===============[ Libraries ]========================*/
process.env.DOTENV_LOADED || require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const path = require("path");
const colors = require("colors");
const fs = require("fs");
const crypto = require("crypto");
const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");
const db = require("../models");
const glob = require("glob");

/* ===============[ 0. Crypto Functions ]====================*/
// 0.1 generateKeysAndSave
const generateKeysAndSave = (privateKeyFile = "private", publicKeyFile = "public") => {
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
      passphrase: process.env.SESSION_SECRET || "SuperSecretSession",
    },
  });

  writeFileSync(path.resolve(__dirname, "../" + privateKeyFile), privateKey);
  writeFileSync(path.resolve(__dirname, "../" + publicKeyFile), publicKey);
};

// 0.2 generateKeys
const generateKeys = () => {
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
      passphrase: process.env.SESSION_SECRET || "SuperSecretSession",
    },
  });

  return {
    private_key: privateKey,
    public_key: publicKey,
  };
};

// encrypt and decrypt constants
// Learn more: https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY;
const iv = crypto.randomBytes(16);

// 0.3 encrypt
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

// 0.4 decrypt
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};


/* ===============[ 1. Helper Functions ]====================*/
// 1.1 generateConfig
const generateConfig = async () => {
  try {
    const CONFIG = require("../config");
    await fs.writeFileSync(path.resolve(__dirname, "../config/config.json"), JSON.stringify(CONFIG, null, 2));

  } catch (error) {
    if (env !== "production") {
      console.log("============[ error ]==============".red);
      console.log(error);
      console.log("========================================".red);
    }
  }
}

// 1.2 isObject
const isObject = (object) => {
  return object != null && typeof object === 'object';
}

// 1.3 deepEqual
const deepEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}


/**
 * 1.4 Array2Table
 * @param {array} arr - array of objects
 */
const Array2Table = (arr, generateHtml = true) => {
  let Table = [];
  let top_row = [];
  let rows = [];

  for (let i = 0; i < arr.length; i++) {
    let cells = [];

    for (let property in arr[i]) {
      if (top_row.length < Object.keys(arr[i]).length) {
        if (generateHtml) {
          top_row.push(`<th scope="col">${property}</th>`);
        } else {
          top_row.push(property);
        }
      }
      if (arr[i][property] === null) {
        if (generateHtml) {
          cells.push(`<td>${null}</td>`);
        } else {
          cells.push(null);
        }
      } else {
        if (generateHtml) {
          cells.push(`<td>${arr[i][property]}</td>`);
        } else {
          cells.push(arr[i][property]);
        }
      }
    }

    if (generateHtml) {
      rows.push(`<tr>${cells.join("")}</tr>`);
    } else {
      rows.push(cells);
    }
  }

  if (generateHtml) {
    Table.push(`<table>`);
    Table.push(`<thead>${top_row.join("")}</thead>`);
    Table.push(`<tbody>${rows.join("")}<tbody>`);
    Table.push("</table>");
    return Table.join("");
  }

  return { top_row, rows };
}

/**
 * 1.5 humanize 
 * ex: request_id = Request Id
 * 
 * @param {string} str 
 * @return Humanized String
 */
const humanize = (str) => {
  if (typeof str !== "string" || str === null || str === undefined || str.length === 0) return str;
  const dateFields = ['download_expires_at', 'last_downloaded_timestamp', 'createdAt', 'updatedAt'];
  let i, frags = /[_]/g.test(str.toString().trim()) ? str.toString().trim().split('_') : (/[ ]/g.test(str.toString().trim()) ? str.toString().trim().split(' ') : [str.toString().trim()]);

  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + (dateFields.includes(str) ? frags[i].slice(1) : frags[i].slice(1).toLowerCase());
  }

  return frags.join(' ');
}

/**
 * 1.6 dehumanize
 * Does the opposite of humanize
 * @param {string} str 
 * @return Dehumanized String
 */
const dehumanize = (str) => {
  if (typeof str !== "string") return str;
  let implodedStr = str.split(' ').join('_');
  return implodedStr.toLowerCase();
}

/**
 * 1.7 getDirectories
 */
const getDirectories = (src, callback) => {
  glob(src + '/**/*', callback);
};

/**
 * 1.8 listDirFilesByType
 * Lists all files under specified directory by specified type. 
 * 
 * @param {string} directory - Directory to begin searching for files recursively. 
 * @param {array} typeArray - File types to be listed. Don't use dot. Empty means get all files. 
 * @param {boolean} saveIt - true will save a file of the resulting array. False will return the resulting array. 
 * @return {array} allFiles - only returns when saveIt is set to false. 
 */
const listDirFilesByType = async (directoryPath, typeArray = [], saveIt = true, resolvePath = true) => {
  let dirPath;
  let fileTypes = (typeArray.length > 0) ? typeArray.map(t => t.toLowerCase()) : (process.argv.slice(2)[1] !== undefined ? (process.argv.slice(2)[1].split(",")).map(t => t.toLowerCase()) : []);

  if (directoryPath === undefined && process.argv.length > 2 && fs.statSync(process.argv.slice(2)[0]).isDirectory()) {
    dirPath = process.argv.slice(2)[0];
  } else if (typeof directoryPath === "string" && fs.statSync(directoryPath).isDirectory()) {
    dirPath = directoryPath;
  } else {
    console.log("===================================".red);
    console.log("Invalid arguments were passed.".red);
    console.log(process.argv.slice(2));
    console.log("===================================".red);
    return;
  }

  let allFiles;
  try {
    if (fileTypes.length > 0) {
      allFiles = await new Promise((resolve, reject) => {
        getDirectories(dirPath, (err, results) => {
          if (err) {
            reject(new Error(err));
            return;
          } else {
            if (resolvePath) {
              resolve(results.filter((file) => (fileTypes.includes(file.toLowerCase().split(".").pop()))).map((file) => path.resolve(file)));
            } else {
              resolve(results.filter((file) => (fileTypes.includes(file.toLowerCase().split(".").pop()))));
            }
            return;
          }
        });
      });
    } else {
      allFiles = await new Promise((resolve, reject) => {
        getDirectories(dirPath, (err, results) => {
          if (err) {
            reject(new Error(err));
            return;
          } else {
            if (resolvePath) {
              resolve(results.map((file) => path.resolve(file)));
            } else {
              resolve(results);
            }
            return;
          }
        });
      });
    }

    exit_code = 0;
  } catch (error) {
    console.log("===================================".red);
    console.log(error);
    console.log("===================================".red);

    return allFiles;
  }

  if (saveIt) {
    let savedFile = path.join(`${dirPath}/allFiles_${Date.now()}.json`);
    fs.writeFileSync(savedFile, JSON.stringify({ allFiles }), 'utf8');
    console.log("____________ allFiles ____________".green);
    console.log(allFiles);
    console.log(allFiles.length + " files found.".green);
    console.log(`Saved to ${savedFile}`.green);
    console.log("__________________________________".green);
    return exit_code;
  }

  return allFiles;
}

/**
 * 1.9 blockingWait
 * @param {*} seconds 
 */
const blockingWait = (seconds = 1) => {
  const waitTill = new Date(new Date().getTime() + seconds * 1000);
  while (waitTill > new Date()) { };
}

// 1.10 Loop through an array of objects
const loopArrayObject = (resultsArray) => {
  var top_row = [];
  var rows = [];

  for (var i = 0; i < resultsArray.length; i++) {
    var cells = [];

    for (var property in resultsArray[i]) {
      if (resultsArray[i].hasOwnProperty(property)) {
        if (
          top_row === undefined ||
          top_row.length < Object.keys(resultsArray[i]).length
        ) {
          top_row.push(property.red);
        }
        if (resultsArray[i][property] === null) {
          cells.push(null);
        } else {
          cells.push(resultsArray[i][property].toString().green);
        }
      }
    }

    rows.push(cells);
  }

  var Table = [];
  // var Table = new PrettyTable({
  //   head: top_row,
  // });

  for (var r = 0; r < rows.length; r++) {
    Table.push(rows[r]);
  }

  console.log(Table);
};

// 1.11 Loop through an object
const loopObject = (resultsObject) => {
  var top_row = [];
  var rows = [];
  var cells = [];

  for (var property in resultsObject) {
    if (resultsObject.hasOwnProperty(property)) {
      if (
        top_row === undefined ||
        top_row.length < Object.keys(resultsObject).length
      ) {
        top_row.push(property.red);
      }
      cells.push(resultsObject[property].toString().green);
    }
  }

  rows.push(cells);

  var Table = [];
  for (var r = 0; r < rows.length; r++) {
    Table.push(rows[r]);
  }

  console.log(Table);
  return;
};

// 1.12 listAll
const listAll = (jsonExport) => {
  let columns;
  for (let query in jsonExport) {
    columns = ["Row [#]"].concat(
      Object.getOwnPropertyNames(jsonExport[query][0]),
    );
    var rows = [];

    jsonExport[query].forEach((account, index) => {
      let cells = [];
      cells.push((index + 1).toString().yellow);

      for (let j = 0; j < columns.length; j++) {
        if (account.hasOwnProperty(columns[j])) {
          cells.push(account[columns[j]].toString().yellow);
        }
      }

      rows.push(cells);
    });
  }

  var Table = [];

  for (var r = 0; r < rows.length; r++) {
    Table.push(rows[r]);
  }

  console.log(Table);
};

/* ===============[ 2. Seed DB Functions ]===================*/
// 2.1 seed_demo_user
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

    await userController
      .insert(values, condition)
      .then((response) => {
        if (response) {
          console.log("Successfully inserted demo user!".green);
        } else {
          console.log(demo_user + " Already in database!".green);
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
};

// 2.2 seed_employees
const seed_employees = async () => {
  const employees_json = require("../scripts/employees.json");
  console.log("_________________________________________________".red);
  console.log("Deleting employees".red);
  console.log("_________________________________________________".red);
  await db.employees.destroy({ truncate: true, cascade: false });

  for (let property in employees_json) {
    if (Array.isArray(employees_json[property])) {
      var i,
        j,
        temparray,
        chunk = 10000; // Limit number of records to be created at a time

      console.log("_________________________________________________".yellow);
      console.log(
        "Seeding employees table".yellow +
        chunk +
        " records at a time.".yellow,
      );
      console.log("_________________________________________________".yellow);

      for (i = 0, j = employees_json[property].length; i < j; i += chunk) {
        temparray = employees_json[property].slice(i, i + chunk);

        await db.employees
          .bulkCreate(temparray, { returning: true, raw: true })
          .then((response) => {
            console.log(
              "_________________________________________________".green,
            );
            console.log(
              "Successfully inserted ".green +
              response.length +
              " records!".green,
            );
            console.log(`At ${i} of ${j}`);
            console.log(
              "_________________________________________________".green,
            );
          })
          .catch((error) => {
            console.log(
              "_________________________________________________".red,
            );
            console.log("Failed!".red);
            console.log(error);
            console.log(
              "_________________________________________________".red,
            );
          });

        if (i === j - chunk) {
          console.log(
            "_________________________________________________".green,
          );
          console.log("Finished inserting " + j + " records!".green);
          console.log(
            "_________________________________________________".green,
          );
        }
      }

      return 0;
    }
  }
};

let Func = {
  generateKeysAndSave,
  generateKeys,
  encrypt,
  decrypt,
  generateConfig,
  isObject,
  deepEqual,
  Array2Table,
  humanize,
  dehumanize,
  getDirectories,
  listDirFilesByType,
  blockingWait,
  loopArrayObject,
  loopObject,
  listAll,
  seed_demo_user,
  seed_employees
};

module.exports = Func;
