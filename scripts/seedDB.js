const colors = require("colors");
const seed_demo_user = require("./seed_demo_user");
const seed_employees = require("./seed_employees");

const seedAll = async () => {
  let exit_code = 0;
  console.log(
    "=================[ Seeding Demo User ]=========================".yellow,
  );
  exit_code = await seed_demo_user();

  console.log(
    "=================[ Seeding Employees ]=========================".yellow,
  );
  exit_code = await seed_employees();

  process.exit(exit_code);
};

seedAll();
