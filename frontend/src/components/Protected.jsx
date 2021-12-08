import React, { useEffect, useState, useContext } from 'react';
import { UserContext, Loading } from '../App';

const ProtectedData = ({ protectedUrl, user }) => (
	<>
		<h1 className="text-danger py-3">Hi {user.email}, this is a protected data that only you can see!</h1>

		<div className="py-5">
			<img src={protectedUrl} alt="Protected data" title="Protected data" className="img-thumbnail" />
		</div>

		<p className="text-dark pt-3">
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
		</p>
	</>
)

const Protected = () => {
	// Could have something here to check for the time when the accesstoken expires
  // and then call the refresh_token endpoint to get a new accesstoken automatically
  const [user] = useContext(UserContext);
  const [content, setContent] = useState(<Loading />)

  useEffect(() => {
  	async function fetchProtectedData() {
  		const result = await (await fetch('http://localhost:4000/protected', {
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/json',
  				Authorization: `Bearer ${user.accesstoken}`,
  			}
  		})).json()

  		if (result.data) {
  			setContent(<ProtectedData protectedUrl={result.data} user={user} />)
  		} else {
  			setContent(<h1 className="text-danger p-5">You need to login, to access this data!!</h1>)
  			alert(result.error)
  		}
  	}

  	fetchProtectedData();
  }, [user])

	return (
		<div>
			{content}
		</div>
	)
}

export default Protected