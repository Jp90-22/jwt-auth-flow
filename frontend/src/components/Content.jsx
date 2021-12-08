import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { UserContext } from '../App';

const Content = () => {
	// Could have something here to check for the time when the accesstoken expires
  	// and then call the refresh_token endpoint to get a new accesstoken automatically
  	const [user] = useContext(UserContext)

  	if (!user.accesstoken) return <Navigate replace to="/login" />

	return (
		<div>
			<h1 className="text-primary py-3">Hello {user.email} ! this is the content page</h1>
			<p className="text-dark">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
			</p>
		</div>
	)
}

export default Content