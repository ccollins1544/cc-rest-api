const db = require("../models");

module.exports = {
  findByEmpNo: (req, res) => {
    db.employees
      .findOne({
        where: {
          id: req.params.emp_no,
        },
        order: [["emp_no", "ASC"]],
      })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  upsert: async (values, condition) => {
    return await db.employees
      .findOne({
        where: condition,
      })
      .then((dbModel) => {
        if (dbModel) {
          return dbModel.update(values);
        }

        return db.employees.create(values);
      });
  },

  insert: (values, condition) => {
    return db.employees
      .findOne({
        where: condition,
      })
      .then((dbModel) => {
        if (dbModel) {
          console.log("Already in database.");
          return;
        }

        return db.employees.create(values);
      });
  },
};
