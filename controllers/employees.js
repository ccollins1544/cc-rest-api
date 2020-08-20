const db = require("../models");

module.exports = {
  findAll: (req, res) => {
    // ?limit=1000&orderby=last_name&order=asc
    let { limit, orderby, order } = req.query;

    if (limit === undefined) {
      limit = 100;
    } else if (parseInt(limit) > 1000) {
      limit = 1000; // forcing a max limit of 1000
    }

    if (orderby === undefined) {
      orderby = "last_name";
    }

    if (order === undefined) {
      order = "ASC";
    }

    db.employees
      .findAll({
        order: [[orderby, order]],
        limit: parseInt(limit),
      })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  findByEmpNo: (req, res) => {
    let condition = { emp_no: req.params.emp_no };
    db.employees
      .findOne({
        where: condition,
      })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  put: async (req, res) => {
    let condition = { emp_no: req.params.emp_no };
    let results = await db.employees
      .findOne({
        where: condition,
      })
      .then((dbModel) => {
        if (dbModel) {
          return dbModel.update(req.body);
        }

        return res.status(400).send({
          ok: false,
          message: "Can't find that employee.",
        });
      });

    res.status(200).json(results);
  },

  create: (req, res) => {
    if (req.body.emp_no === undefined || Object.keys(req.body).length <= 1) {
      return db.employees
        .create(req.body)
        .then((dbModel) => res.status(200).json(dbModel))
        .catch((err) => res.status(422).json(err));
    }

    let condition = { emp_no: req.body.emp_no };
    db.employees
      .findOne({
        where: condition,
      })
      .then((dbModel) => {
        if (dbModel) {
          return res.status(400).send({
            ok: false,
            message:
              "That employee already exists. Use a different method to update.",
          });
        }

        return db.employees
          .create(req.body)
          .then((dbModel) => res.status(200).json(dbModel))
          .catch((err) => res.status(422).json(err));
      })
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

  delete: (req, res) => {
    let condition = { emp_no: req.params.emp_no };
    db.employees
      .destroy({
        where: condition,
      })
      .then((dbModel) => {
        if (dbModel) {
          res.status(200).send({
            ok: true,
            message: `emp_no ${req.params.emp_no} has been deleted.`,
          });
        }

        res.status(404).send({
          ok: false,
          message: `emp_no ${req.params.emp_no} doesn't exists.`,
        });
      })
      .catch((err) => res.status(422).json(err));
  },
};
