require('dotenv/config');
const express = require('express');
const path = require('path'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken
} = require('./tokens.js');
const { fakeDb } = require('./fakeDB.js');
const { isAuth } = require('./isAuth.js');

// Seting up a server using express
const server = express();

/**
 * Using express midleware:
 */
server.use(cookieParser()); // For easier cookie handling

// Seting up cors for allow react server origin
server.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

/**
 * Needed to be able to read body data
 */
server.use(express.json()); // To support JSON-encoded bodies
server.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies

/**
 * Serving static procted data 
 */
server.use('/protected', express.static(path.join(__dirname, 'protected')));

// Listen on port 4000
server.listen(process.env.PORT || 4000, 
	() => console.log(`Server listening on port ${process.env.PORT || 4000}`)
);

// End points 

/** 
 * 1. Async Register a user
 */
server.post('/register', async (req, res) => {
	console.log('Entering on endpoint: /regiter')
	
	const { email, password } = req.body;

	console.log('-> Registering user email: ' + email +' and hashing its password')
	try {
		// Check if user exists
		const user =  fakeDb.find(user => user.email === email)
		if (user) throw Error("The User already exists in the DB")

		const hashedPassword = await hash(password, 10);
		fakeDb.push({
			id: fakeDb.length,
			email,
			password: hashedPassword
		})

		console.log("-> User Registered, now DB looks like:");
		console.log(fakeDb)

		res.send({
			message: "User created successfully"
		})
	} catch (err) {
		console.log("-> " + err.message.toString())
		res.send({ 
			error: "Error: " + err.message.toString() 
		})
	}
})


/**
 * 2. Login a user
 */
server.post('/login', async (req, res) => {
	console.log("Entering on endpoint: /login")

	const { email, password } = req.body;

	try {
		// Find user in our "db", if not exists send error
    	console.log("-> Validating user information...")
		const user = fakeDb.find(user => user.email === email)
		if (!user) throw Error("User not exists")

		// Compare crypted password and see if it checks out. Send error if not
		const valid = await compare(password, user.password)
		if (!valid) throw Error("Incrorrect password")

		// Create Refresh and Access tokens
    	console.log("-> Creating tokens...")
		const refreshToken = createRefreshToken(user.id)
		const accessToken = createAccessToken(user.id)

		// Store Refreshtoken with user in "db"
	    // Could also use different version numbers instead.
	    // Then just increase the version number on the revoke endpoint
    	user.refreshToken = refreshToken

    	// Send token. Refreshtoken as a cookie and accesstoken as a regular response
    	console.log("-> Sending tokens...")
    	sendRefreshToken(res, refreshToken)
    	sendAccessToken(res, req, accessToken)

    	console.log("-> User logged in successfully, now db looks like:")
    	console.log(fakeDb)
	} catch (err) {
		console.log("-> " + err.message.toString())
		res.send({
			error: "Error: " + err.message.toString(),
		})
	}
})

/**
 * 3. Logout a user
 */
server.post('/logout', async (req, res) => {
	console.log("Entering on endpoint: /logout")

	console.log("-> Clearing cookie")
	res.clearCookie('refreshtoken', { path: '/refresh_token' });
	// Logic here for also remove refreshtoken from db
	
	console.log("-> User logged out successfully, now db looks like:")
    console.log(fakeDb)
	return res.send({
		message: 'Logged out',
	});
})

/**
 * 4. Protected route
 */
server.post('/protected', async (req, res) => {
	console.log("Entering on endpoint: /protected")	

	console.log("-> Authenticating user...")
	try {
		const userId = isAuth(req);
		if (userId !== null) {
			console.log("-> User authenticated successfully")

			res.send({
				data: 'http://localhost:4000/protected/confidencial.jpg',
			});
		}
	} catch (err) {
		console.log("-> " + err.message.toString())
		res.send({
			error: "Error: " + err.message.toString(),
		});
	}
});

/**
 * 5. Get a new access token with a refresh token
 */
server.post('/refresh_token', (req, res) => {
	console.log("Entering on endpoint: /refresh_token")	

	const token = req.cookies.refresh_token;
	console.log("-> " + token)

	// If we don't have a token in our request
	if (!token) return res.send({ accesstoken: '' });
	
	console.log("-> Verifying the token...")	
	// We have a token, let's verify it!
	let payload = null;
	try {
		payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
	} catch (err) {
		return res.send({ accesstoken: '' });
	}
	
	console.log("-> Verifying user...")	
	// token is valid, check if user exist
	const user = fakeDb.find(user => user.id === payload.userId);
	if (!user) return res.send({ accesstoken: '' });
	
	// user exist, check if refreshtoken exist on user
	if (user.refreshtoken !== token) return res.send({ accesstoken: '' });

	console.log("-> Creating and sending new tokens to user...")	
	// token exist, create new Refresh- and accesstoken
	const accessToken = createAccessToken(user.id);
	const refreshToken = createRefreshToken(user.id);

	// update refreshtoken on user in db
	// Could have different versions instead!
	user.refreshtoken = refreshToken;
	
	// All good to go, send new refreshtoken and accesstoken
	sendRefreshToken(res, refreshToken);
	return res.send({ accessToken });
});