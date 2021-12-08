import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();

		const result = await (await fetch('http://localhost:4000/register', {
    	method: 'POST',
   		headers: {
      	'Content-Type': 'application/json',
    	},
	    body: JSON.stringify({
	      email,
	      password,
	    }),
	  })).json();

		if (result.message) {
			alert(result.message);
			navigate('/')
		} else {
			alert(result.error);
		}
	};

	const onEmailChange = e => setEmail(e.target.value)
	const onPasswordChange = e => setPassword(e.target.value)

	return ( 
		<div className="login-wrapper">
			<form onSubmit={handleSubmit}>
				<h1 className="my-3">Register</h1>
				<div className="login-inputs">
					<label htmlFor="email">E-mail: </label>
					<input
						className="mb-4"
						id="email"
						value={email}
						onChange={onEmailChange}
						required
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
						required
						type="password"
						name="password"
						autoComplete="current-password"
						placeholder="Password"
					/>
					<button type="submit">Register</button>
				</div>
			</form>
		</div>
	);
}

export default Register