# CC REST API

This app is a template created with **[express-generator](https://expressjs.com/en/starter/generator.html)** and uses [jsonwebtoken (jwt)](https://www.npmjs.com/package/jsonwebtoken) to create tokens with private and public keys. The JWT token can then be used in the headers as an `Authorization bearer` to gain access to secure api endpoints.

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

Create the file `.env` in the root of the project folder `cc-rest-api` and copy and paste this,

```shell
DEBUG=false
USERNAME=demo
PASSWORD=123456
ISSUER=demo-issuer
SUBJECT=demo-subject
AUDIENCE=demo-audience
MAX_AGE=3600000
EXPIRATION=3600000
SESSION_SECRET=secret-goes-here
FA_SCRIPT=
```

**NOTE:** You can set these values to whatever you want. The expiration value `3600000` represents 1 hour in milliseconds (60min - 60sec - 1000 = 3600000). The `MAX_AGE` does need to equal `EXPIRATION` value. `FA_SCRIPT` is for the FontAwesome CDN script which can be blank if you don't have one. `FA_SCRIPT` must be a `.js` script don't try to use `.css`.

### 3. In the project directory, you can run:

```shell
cd cc-rest-api
```

#### `DEBUG=cc-rest-api:* nodemon`

#### `DEBUG=cc-rest-api:* npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🥑 Usage

#### Available Routes

| Path         | Method | Description                                                            |
| :----------- | ------ | :--------------------------------------------------------------------- |
| /            | GET    | Home page                                                              |
| /login       | GET    | Login page                                                             |
| /login       | POST   | Send valid username and password in request body and crates new token. |
| /logout      | DELETE | Destroys your session.                                                 |
| /api/token   | GET    | \*Current JSON Web Token.                                              |
| /api/payload | GET    | \*Payload from decodedToken.                                           |

\*Secured route.

## 🏆 Credit

- [Christopher Collins](https://ccollins.io)
