# CC REST API

This app is a template created with **[express-generator)[https://expressjs.com/en/starter/generator.html]** and uses [jsonwebtoken(jwt)](https://www.npmjs.com/package/jsonwebtoken) to create secure api endpoints.

## Available Scripts

In the project directory, you can run:

### `DEBUG=cc-rest-api:* nodemon`

### `DEBUG=cc-rest-api:* npm start`

Runs the app.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🚀 Quick start

This app was created using **[express-generator)[https://expressjs.com/en/starter/generator.html]** tool. If you would like to use any of the code in this repository I recommend running the express generator tool to get the base files and then you can easily see what files I've changed and make your own updates as needed.

1.**Install Express Generator** (optional)

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

2.**Build Skeleton File Structure**

```shell
express myapp
```

Or if you would like to use handlebars set the `--view` argument to hbs,

```shell
exprss --view=hbs myapp
```

3.**Set Environment Variables**

Create the file `.env` and copy/paste this,

```
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

**[OPTIONAL]\*** Create another file `.env.override` identical to `.env` but only if you plan to test different values like a different username/password. Because sometimes the app doesn't refresh the new values when I change them so I use `.env.override` to force updates. If you are going to use `.env.override` make sure to keep it identical to `.env`.

3.**Update Login Route to Generate a Token**
Copy [login.js](routes/login.js)

### Credit

- [Christopher Collins](https://ccollins.io)
