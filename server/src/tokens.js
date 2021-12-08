const { sign } = require("jsonwebtoken")

const createAccessToken = userId => 
	sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m'
	})

const createRefreshToken = userId => 
	sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d'
	})

const sendAccessToken = (res, req, accessToken) => {
	res.send({
		accessToken,
		email: req.body.email,
	})
}

const sendRefreshToken = (res, refreshToken) => {
	res.cookie('refresh_token', refreshToken, {
		httpOnly: true,
		path: '/refresh_token',
	})
}

module.exports = {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken
}