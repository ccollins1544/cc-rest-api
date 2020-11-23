# CC REST API

This app is a template created with **[express-generator](https://expressjs.com/en/starter/generator.html)** and uses [jsonwebtoken (jwt)](https://www.npmjs.com/package/jsonwebtoken) to create tokens with private and public keys. The JWT token can then be used in the headers as an `Authorization bearer` to gain access to secure api endpoints.

## 💫 Deploy

### Master branch
You can see live demo of this project [here](https://ancient-bastion-93975.herokuapp.com/)

### Beta branch
[![Website](https://img.shields.io/website?down_color=red&down_message=down&up_color=green&up_message=up&url=http%3A%2F%2Fnode.ccollins.io%2F)](http://node.ccollins.io)
[![Deploy Beta](https://github.com/ccollins1544/cc-rest-api/workflows/Deploy%20Beta/badge.svg)](https://github.com/ccollins1544/cc-rest-api/actions)

#### Username: `demo`

#### Password: `123456`

## 🚀 Quick start

**NOTE:** Look at the README in the get-started branch for in depth setup of how this app was created.

### 1. 💾 Get the code downloaded

- Use the **get-started** branch for a basic version by the git clone command,

```shell
git clone --single-branch --branch get-started git@github.com:ccollins1544/cc-rest-api.git
```

- Use the **no-db** branch for simple use authentication with no database by the git clone command,

```shell
git clone --single-branch --branch no-db git@github.com:ccollins1544/cc-rest-api.git
```

- Use the **passport-sequelize** branch for user authentication with passport and a CRUD API for the employee model by the git clone command,

```shell
git clone --single-branch --branch passport-sequelize git@github.com:ccollins1544/cc-rest-api.git
```

### 2. 👨🏼‍🔬 Set Environment Variables

Create the file `.env` in the root of the project folder `cc-rest-api` and copy and paste this,

```shell
# Main Env Variables
NODE_ENV=test
DEBUG=cc-rest-api:*
DOTENV_LOADED=true
FA_SCRIPT=
OVERRIDE_LOGIN=false

# JWT Variables
ISSUER=demo-issuer
SUBJECT=demo-subject
AUDIENCE=demo-audience
MAX_AGE=3600000
EXPIRATION=3600000
SESSION_SECRET=secret-goes-here
SECRET_KEY="---32-character-key-goes-here---"

# DB Seed Variables
DEMO_USER=demo
DEMO_PASSWORD=123456
SEED_EMPLOYEES=false

# Database Connection Credentials
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=cc_rest_api
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_TIMEZONE="-06:00"
```

**NOTE:** You can set these values to whatever you want. See definitions below.

### 📦 Env Variable Definitions

| Name           | Description                                                                                                                                                               | DEFAULT          |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------- |
| NODE_ENV       | When this is set to `development` the database is reset and all previous data is lost. Should be set to testing or production normally.                                   | test             |
| DOTENV_LOADED  | Should always be set to true. Used to verify that this file `.env` is loaded.                                                                                             | true             |
| FA_SCRIPT      | Is for the FontAwesome CDN script which can be blank if you don't have one. Must be a `.js` script don't try to use `.css`.                                               |                  |
| DEBUG          | Outputs more to the console log when set to true.                                                                                                                         | false            |
| ISSUER         | Stored in payload.                                                                                                                                                        | demo-issuer      |
| SUBJECT        | Stored in payload.                                                                                                                                                        | demo-subject     |
| AUDIENCE       | Stored in payload.                                                                                                                                                        | demo-audience    |
| MAX_AGE        | The expiration value `3600000` represents 1 hour in milliseconds (60min x 60sec x 1000 = 3600000). The `MAX_AGE` does need to equal `EXPIRATION` value.                   | 3600000          |
| EXPIRATION     | The expiration value `3600000` represents 1 hour in milliseconds (60min x 60sec x 1000 = 3600000).                                                                        | 3600000          |
| SESSION_SECRET | Used in passport session cookies.                                                                                                                                         | secret-goes-here |
| DEMO_USER      | Demo user. Will be seeded to the database user table automatically.                                                                                                       | demo             |
| DEMO_PASSWORD  | Demo user password. Will be seeded to the database user table automatically.                                                                                              | 123456           |
| SEED_EMPLOYEES | Seeds the database with employees from scripts/employees. Make sure to set this to false when done. All previous data is destroy and reset every time the server reloads. | false            |
| MYSQL_HOST     | Used for your database connection.                                                                                                                                        | localhost        |
| MYSQL_PORT     | Used for your database connection.                                                                                                                                        | 3306             |
| MYSQL_DATABASE | Used for your database connection.                                                                                                                                        | cc_rest_api      |
| MYSQL_USER     | Used for your database connection.                                                                                                                                        |                  |
| MYSQL_PASSWORD | Used for your database connection.                                                                                                                                        |                  |
| MYSQL_TIMEZONE | Used for your database connection.                                                                                                                                        | "-06:00"         |

### 3. 👨🏼‍🏫 In the project directory, you can run:

```shell
cd cc-rest-api
```

#### `nodemon`

#### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🥑 Usage

### 📘 Employees Model Routes

| Path                 | Method | Description                                                                                                   |
| :------------------- | ------ | :------------------------------------------------------------------------------------------------------------ |
| /api/employee        | GET    | Retrieves all data from employees. Can accept query parameters ?limit=1000&orderby=last_name&order=asc.       |
| /api/employee/emp_no | GET    | Retrieves single item from employees.                                                                         |
| /api/employee        | POST   | Inserts new item to employees. If emp_no is passed in the request body then we'll check if exists and update. |
| /api/employee/emp_no | PUT    | Updates an existing item from employees and returns the updated item in the response.                         |
| /api/employee/emp_no | DELETE | Deletes an item from employees.                                                                               |

**NOTE:** All of these routes are secured with JWT.

### 📘 Misc Routes

| Path         | Method | Description                                                             |
| :----------- | ------ | :---------------------------------------------------------------------- |
| /            | GET    | \*Index page                                                            |
| /login       | GET    | \*Login page                                                            |
| /login       | POST   | Send valid username and password in request body and creates new token. |
| /logout      | DELETE | Destroys your session and removes token and payload from local storage. |
| /api/token   | GET    | Current JSON Web Token.                                                 |
| /api/payload | GET    | Payload from decodedToken.                                              |

\*Not secured route with JWT. All the rest of these routes are secured with JWT.

### ⭐ Securing Routes

Secured routes using jwtStrategy `validateAccessToken`. JWT tokens are generated when a user logs in and expires depending on what was set in the `.env` file (defaults 1hour expiration). Which means any valid token can be used to access this api from a different source.

For example, see the `/api/payload` route,

```javascript
const router = require("express").Router();
const methods = require("../../middlewares/jwtStrategy");

// Matches with "/api/payload" GET
router.route("/").get(methods.validateAccessToken, (req, res, next) => {
  res.status(200).send(req.session.payload);
});

module.exports = router;
```

Normally the JWT should be good enough but if you would like to verify the user table has the most recent `last_used_token` then use `userController.login` as well as `methods.validateAccessToken`. This will make sure the `last_used_token` is up-to-date and will update `req.session.logged_in = true`.

For example, see the `/` index route,

```javascript
// Matches with "/" GET
router.get(
  "/",
  methods.validateAccessToken,
  userController.login,
  (req, res, next) => {
    let jadeProps = {
      site_title: "CC REST API",
      page_title: "Home",
      slug: "home",
      fa_script: process.env.FA_SCRIPT || false,
      demo_user: process.env.DEMO_USER || false,
      logged_in: req.session.logged_in,
      email: req.session.email,
      token: req.session.token,
      payload: req.session.payload,
    };

    res.render("index", jadeProps);
  },
);

module.exports = router;
```

## 🏆 Credit

- [Christopher Collins](https://ccollins.io)
