process.env.DOTENV_LOADED || require("dotenv").config();

// NOTE: TEST YOUR DB CONNECTION VIA COMMAND,
// mysql -u USERNAME -pPASSWORD -h HOSTNAMEORIP DATABASENAME 

const default_options = {
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
  timezone: process.env.MYSQL_TIMEZONE || "-06:00",
  pool: {
    max: 10,
    min: 0,
    acquire: 150000,
    idle: 50000,
  },
  logging: process.env.DBLOGGING === 'true' || false
}

const config = {
  "development": {
    ...default_options
  },
  "test": {
    ...default_options
  },
  "production": {
    ...default_options,
    use_env_variable: "JAWSDB_URL",
  }
}

module.exports = config;
