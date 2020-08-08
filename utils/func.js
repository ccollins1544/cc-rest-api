/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1
 *   1.2 loopArrayObject
 *   1.3 loopObject
 *   1.4 listAll
 *
 ******************************************************/
/* ===============[ Libraries ]========================*/
const NodeRSA = require("node-rsa");
const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");
const path = require("path");
const PrettyTable = require("cli-table2");
const colors = require("colors");

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

  // Loop through an array of objects
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

  // Loop through an object
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
};

module.exports = Func;
