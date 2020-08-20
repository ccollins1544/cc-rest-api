/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Helper Functions
 *   1.1 generateKeysAndSave
 *   1.2 generateKeysAndSave
 *   1.3 loopArrayObject
 *   1.4 loopObject
 *   1.5 listAll
 *
 * 2. Seed DB Functions
 *   2.1 seed_demo_user
 *   2.2 seed_employees
 *
 ******************************************************/
/* ===============[ Libraries ]========================*/
process.env.DOTENV_LOADED || require("dotenv").config();
const path = require("path"),
  PrettyTable = require("cli-table2"),
  colors = require("colors"),
  db = require("../models"),
  { writeFileSync } = require("fs"),
  { generateKeyPairSync } = require("crypto");

/* ===============[ 1. Helper Functions ]====================*/
let Func = {
  // 1.1 generateKeysAndSave
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

  // 1.2 generateKeys
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

  // 1.3 Loop through an array of objects
  loopArrayObject: function (resultsArray) {
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

    var Table = new PrettyTable({
      head: top_row,
    });

    for (var r = 0; r < rows.length; r++) {
      Table.push(rows[r]);
    }

    console.log(Table.toString());
  },

  // 1.4 Loop through an object
  loopObject: function (resultsObject) {
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

    var Table = new PrettyTable({
      head: top_row,
    });

    for (var r = 0; r < rows.length; r++) {
      Table.push(rows[r]);
    }

    console.log(Table.toString());
    return;
  },

  // 1.5 listAll
  listAll: (jsonExport) => {
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

    var Table = new PrettyTable({
      head: columns,
    });

    for (var r = 0; r < rows.length; r++) {
      Table.push(rows[r]);
    }

    console.log(Table.toString());
  },

  /* ===============[ 2. Seed DB Functions ]===================*/
  // 2.1 seed_demo_user
  seed_demo_user: async () => {
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
  },

  // 2.2 seed_employees
  seed_employees: async () => {
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
  },
};

module.exports = Func;
