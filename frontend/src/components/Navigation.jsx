import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

const Navigation = ({ logOutCallback }) => {
	const [user] = useContext(UserContext)

	return (
		<ul className="bg-white w-75 m-5 p-2 border rounded shadow-lg sticky-top">
			<li><Link to='/'>Home</Link></li>
			<li><Link to='/protected'>Protected</Link></li>
			<li><Link to='/register'>Register</Link></li>
			<li className="text-warning"><b>{user.email}</b></li>
			<li>{user.accesstoken
				? <button className="btn btn-danger btn-sm" onClick={logOutCallback}>Log Out</button>
				: <Link className="btn btn-success btn-sm" to='login'>Log in</Link>
			}
			</li>
		</ul>
	)
}

export default Navigation