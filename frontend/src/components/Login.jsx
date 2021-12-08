import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from '../App';

const Login = () => {
	const [user, setUser] = useContext(UserContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();

		const result = await (await fetch('http://localhost:4000/login', {
    	method: 'POST',
    	credentials: 'include', // Needed to include the cookie
   		headers: {
      	'Content-Type': 'application/json',
    	},
	    body: JSON.stringify({
	      email,
	      password,
	    }),
	  })).json();

		if (result.accessToken) {
			setUser({ 
				accesstoken: result.accessToken, 
				email: result.email,
			});

			alert(`${result.email} has been logged in`);
			navigate('/')
		} else {
			alert(result.error);
		}
	};

	const onEmailChange = e => setEmail(e.target.value)
	const onPasswordChange = e => setPassword(e.target.value)

	useEffect(() => {
		console.log(user)
	}, [user])

	return (
		<>
			{user.accessToken
				? <Navigate replace to="/" /> 
				: <div className="login-wrapper">
						<form onSubmit={handleSubmit}>
							<h1 className="my-3">Login</h1>
							<div className="login-inputs">
								<label htmlFor="email">E-mail: </label>
								<input
									className="mb-4"
									id="email"
									value={email}
									onChange={onEmailChange}
									type="text"
									name="email"
									placeholder="E-mail"
									autoComplete="email"
								/>

								<label htmlFor="password">Password: </label>
								<input
									className="mb-4"
									id="password"
									value={password}
									onChange={onPasswordChange}
									type="password"
									name="password"
									autoComplete="current-password"
									placeholder="Password"
								/>
								<button type="submit">Login</button>
							</div>
						</form>
					</div>
			}
		</>
	);
}

export default Login