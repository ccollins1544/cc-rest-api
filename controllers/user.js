const db = require("../models");

// Defining methods for the userController
module.exports = {
  create: async (req, res) => {
    const { email, password } = req.body;

    let userRecord = await db.User.findOne({
      where: {
        email: email,
      },
      limit: 1,
    }).catch((err) => {
      console.log(`Error while fetching user email ${email}`, err);
    });

    if (userRecord !== null) {
      return res.status(406).json({
        ok: false,
        message: `Sorry, already a user with that email: ${email}`,
      });
    }

    const newUser = await new db.User({
      email: email,
      password: password,
    });

    // let dbResults = await newUser.save((err, savedUser) => {
    await newUser.save((err, savedUser) => {
      if (err) return res.json(err);
    });

    return await res.status(200).json({
      ok: true,
      message: `Successfully created new user ${email}`,
    });
  },

  login: async (req, res, next) => {
    // NOTE: password and token should have already been verified before reaching this function
    let { email } = req.body;
    if (!email) {
      if ("email" in req.session) {
        email = req.session.email;
      } else if ("email" in req.payload) {
        email = req.payload.email;
      }
    }

    let { token } = req.session;
    if (!token) {
      if ("token" in req.body) {
        token = req.body.token.toString();
      } else if ("authorization" in req.headers) {
        token = req.headers.authorization.split(" ")[1].toString();
      }
    }

    if (!email || !token) {
      return res.status(401).send({
        ok: false,
        message: "Either invalid email or token provided",
        email: email,
        token: token,
        logged_in: false,
      });
    }

    let { logged_in } = req.session;
    let last_used_token = await db.User.findOne({
      attributes: ["last_used_token"],
      where: {
        email: email,
      },
    }).then((dbModel) => {
      if (dbModel) {
        return dbModel.dataValues.last_used_token.toString();
      }

      return null;
    });

    if (!logged_in || last_used_token != token) {
      db.User.update(
        { last_used_token: token },
        {
          where: {
            email: email,
          },
        },
      ).then((dbRecord) => {
        req.session.logged_in = true;

        if (req.method == "POST") {
          return res.status(200).send({
            ok: true,
            message: "Login successful",
            email: email,
            token: token,
            logged_in: true,
          });
        }

        next();
      });
    }

    if (req.method == "POST") {
      return res.status(200).send({
        ok: true,
        message: "Already Logged In",
        email: email,
        token: token,
        logged_in: true,
      });
    }

    next();
  },

  findById: (req, res) => {
    db.User.findOne({
      attributes: ["email"],
      where: {
        id: req.params.user_id,
      },
    })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  upsert: (values, condition) => {
    return db.User.findOne({
      where: condition,
    }).then((dbModel) => {
      if (dbModel) {
        return dbModel.update(values);
      }

      return db.User.create(values);
    });
  },

  insert: (values, condition) => {
    return db.User.findOne({
      where: condition,
    }).then((dbModel) => {
      if (dbModel) {
        console.log("Already in database.");
        return;
      }

      return db.User.create(values);
    });
  },
};
