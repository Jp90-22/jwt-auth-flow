# Server example

This is the back-end of application using [ExpressJs](https://expressjs.com/), here you can find a fake DB too, this is just an example about how to use JWT in server side, with logins and authorizations for protected data, users are stored in a fake DB to simulate a little the flow.

## Instalation

1. Clone the repo
   ```sh
   git clone https://github.com/JPdevelop22/jwt-auth-flow.git
   ```
2. Go to back-end side
   ```sh
   cd jwt-auth-flow\server
   ```
3. Install NPM packages
   ```sh
   npm install
   ``` 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the Express server listening on [http://localhost:4000](http://localhost:4000).

### Dependencies

- express
- bcryptjs
- cookie-parser
- cors
- dotenv
- jsonwebtoken