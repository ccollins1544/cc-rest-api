# CC REST API

This app is a template created with **[express-generator](https://expressjs.com/en/starter/generator.html)** and uses [jsonwebtoken (jwt)](https://www.npmjs.com/package/jsonwebtoken) to create secure api endpoints.

## 💫 Available Scripts

In the project directory, you can run:

#### `DEBUG=cc-rest-api:* nodemon`

#### `DEBUG=cc-rest-api:* npm start`

Runs the app.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🚀 Quick start

This app was created using **[express-generator](https://expressjs.com/en/starter/generator.html)** tool. If you would like to use any of the code in this repository I recommend running the express generator tool to get the base files and then you can easily see what files I've changed and make your own updates as needed.

### 1. **Install Express Generator** (optional)

If you can run the follow npx command,

```shell
npx express-generator -h
```

Then you can just use that instead of installing express-generator. Otherwise just install globally with,

```shell
npm install -g express-generator
```

and test that it's installed by running

```shell
express -h
```

**NOTE:** The options for `--view` defaults to jade. So you can specify another view like handlebars by using `--view=hbs`

### 2. **Build Skeleton File Structure**

```shell
express myapp
```

Or if you would like to use handlebars set the `--view` argument to hbs,

```shell
express --view=hbs myapp
```

### 3. **Set Environment Variables**

Create the file `.env` and copy/paste this,

```shell
DEBUG=
USERNAME=
PASSWORD=
ISSUER=
SUBJECT=
AUDIENCE=
MAX_AGE=
EXPIRATION=
```

Set these values to whatever you want. Ideally you would use a database to authenticate username/password so this app is just really basic. Set the USERNAME and PASSWORD that will be used to generate your token.

JWT uses ISSUER, SUBJECT, AUDIENCE, MAX_AGE, and EXPIRATION. The expiration and max_age values should be exactly the same and by default value is in milliseconds so for 1minute you would put 60000. 10 seconds would be 10000. You can also use `1h` for 1 hour and `1d` for one day. (see docs [here](https://www.npmjs.com/package/jsonwebtoken))

**[OPTIONAL]** Create another file `.env.override` identical to `.env` but only if you plan to test different values like a different username/password. Because sometimes the app doesn't refresh the new values when I change them so I use `.env.override` to force updates. If you are going to use `.env.override` make sure to keep it identical to `.env`.

### 4. **Update Login Route to Generate a Token**

Copy [login.js](routes/login.js) to your **routes** folder.
You're welcome to modify the `signOptions` to whatever you want.

```javascript
var signOptions = {
  issuer: iss,
  subject: sub,
  audience: aud,
  expiresIn: exp,
  algorithm: "RS256",
};
```

The primary function of the `/login` route is to run `jwt.sign` and generate a token. Notice how this depends on a file `private.pem` so lets create publicKey and privateKey next.

### 5. **Generate Public and Private Keys**

You can simply just copy the files in `utils` folder. This step is really important because if you don't have these keys generated in the correct format the algorithm `RS256` will not work and it's not obvious why.

Now that you got the `utils` folder update your [app.js](app.js) to match mine exactly. Well maybe not exactly, pay attention to what view engine you're using and update accordingly. You'll notice how the keys are generated with `utils.generateKeys();`

### 6. **Create Method for Verifying Token**

The primary function of the `method.js` is to run `jwt.verify`. Copy [methods.js](methods.js) to your root folder. If you made changes to the `signOptions` just make those same changes here too. You'll noticed we use the privateKey to `jwt.sign` the token and the publicKey to `jwt.verify` the token.

**NOTE**: The console.log

```javascript
console.log("\n Verified: " + JSON.stringify(result));
```

output would be something like,

```javascript
Verified: {"username":"ccollins","iat":1597091851,"exp":1597091861,"aud":"https://ccollins.io","iss":"christopher","sub":"chris@ccollins.io"}
```

where `iat` stands for issued at and `exp` is when the token expires. These values are epoch time values and you can see that this example they are only different by 10 which means the token expires in 10 seconds. You can keep this console here for reference or remove it.

### 7. **Secure A Route**

Now you can finally secure a route with a token simply by using the `method.ensureToken` in any of your routes. For example notice what I did with the [index route](routes/index.js) under routes/index.js.

```javascript
const express = require("express");
const methods = require("../methods");
const router = express.Router();

/* GET home page. */
router.get("/", methods.ensureToken, (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
```

**To secure any route just changed the line**

```javascript
router.get("/", (req, res, next) => {
```

**to**

```javascript
router.get("/", methods.ensureToken, (req, res, next) => {
```

and that will require a valid token to view the route. Also be mindful that the token does expire based on the limit set in your variables `EXPIRATION` and `MAX_AGE`. You can do this with any of your routes to secure them.

### 8. **Test Your Routes**

- a. Run the app with `DEBUG=cc-rest-api:* nodemon` or `DEBUG=cc-rest-api:* npm start`. If didn't clone this repo then change `cc-rest-api` to whatever your app name is.

- b. I use [postman](https://www.postman.com) to test my routes. First, try getting a token by creating a POST route to `http://localhost:3000/login` with body **raw json** as

  ```javascript
  {
      "username": "your_username",
      "password": "your_password"
  }
  ```

  Test sending it. If you got a token in the response

  ```javascript
  {
      "ok": true,
      "message": "Login successful",
      "username": "your_username",
      "token": "eyJhbGciOi....."
  }
  ```

  Then you're good to move to the next step.

- c. Copy the token generated from the previous step and create a GET route to `http://localhost:3000/`. Set the Authorization Type > Bearer Token and paste the token value. Send it! If you're response is the the index view in HTML then that means everything worked! If not you might see and error message that should provide information on what the problem is.

  **That's it!** You can remove all the `console.logs` if you would like to clean it up a bit.

### 🏆 Credit

- [Christopher Collins](https://ccollins.io)
