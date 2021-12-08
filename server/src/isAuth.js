const { verify } = require('jsonwebtoken')

const isAuth = req => {
	const authorization = req.headers['authorization']
	// The authorization header comes like: Bearer {token}
	const token = authorization.split(' ')[1]
	
	if (!token || !authorization) throw new Error('You need to login')
	const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET)

	return userId
}

module.exports = {
	isAuth
}