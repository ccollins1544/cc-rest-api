require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: process.env.MYSQL_TIMEZONE || "US/Mountain",
    pool: {
      max: 10,
      min: 0,
      acquire: 150000,
      idle: 50000,
    },
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    dialectOptions: {
      timezone: "local",
    },
    timezone: process.env.MYSQL_TIMEZONE || "US/Mountain",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 150000,
      idle: 50000,
    },
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: process.env.MYSQL_TIMEZONE || "US/Mountain",
    pool: {
      max: 10,
      min: 0,
      acquire: 150000,
      idle: 50000,
    },
  },
};
