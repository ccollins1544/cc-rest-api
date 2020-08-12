# CC REST API

This app is a template created with **[express-generator](https://expressjs.com/en/starter/generator.html)** and uses [jsonwebtoken (jwt)](https://www.npmjs.com/package/jsonwebtoken) to create secure api endpoints.

## 💫 Deploy

You can see live demo of this project [here](https://ancient-bastion-93975.herokuapp.com/)

#### Username: `demo`

#### Password: `123456`

## 🚀 Quick start

**NOTE:** Look at the README in get-started branch for more information on how this code was created. If you care, other wise you can just use the main branch to get the full blown app.

### 1. Get the code downloaded

- For **basic** version use the the code in the **get-started** branch using the git clone command,

```shell
git clone --single-branch --branch get-started git@github.com:ccollins1544/cc-rest-api.git
```

- For **advanced** version use the git clone command,

```shell
git clone git@github.com:ccollins1544/cc-rest-api.git
```

### 2. **Set Environment Variables**

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
SESSION_SECRET=
FA_SCRIPT=
```

### 3. In the project directory, you can run:

```shell
cd cc-rest-api
```

#### `DEBUG=cc-rest-api:* nodemon`

#### `DEBUG=cc-rest-api:* npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏆 Credit

- [Christopher Collins](https://ccollins.io)
