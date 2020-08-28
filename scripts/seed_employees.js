process.env.DOTENV_LOADED || require("dotenv").config();
const db = require("../models");
const colors = require("colors");
const employees_json = require("./employees.json");

const seed_employees = async () => {
  if (
    process.env.SEED_EMPLOYEES !== undefined &&
    process.env.SEED_EMPLOYEES == "true"
  ) {
    console.log("_________________________________________________".red);
    console.log("Deleting employees".red);
    console.log("_________________________________________________".red);

    await db.Employees.deleteMany({});

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

          await db.Employees.insertMany(temparray, (error, response) => {
            if (error) {
              console.log(
                "_________________________________________________".red,
              );
              console.log("Failed!".red);
              console.log(error);
              console.log(
                "_________________________________________________".red,
              );
            } else {
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
            }
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
  }

  console.log("_________________________________________________".yellow);
  console.log("Not seeding employees. SEED_EMPLOYEES=false".yellow);
  console.log("_________________________________________________".yellow);
  return 1;
};

module.exports = seed_employees;
