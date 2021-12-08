import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Content,
  Login,
  Navigation,
  Protected,
  Register
} from './components'

import './App.css';
import logo from './logo.svg';

export const UserContext = React.createContext([]);

export const Loading = () => (
  <div className="spinner-border text-dark m-5" style={({ width: "5rem", height: "5rem" })} role="loading">
    <span className="visually-hidden">Loading...</span>
  </div>
)

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logoutCallback = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include', // Needed to include the cookie
    });

    // Cler user from our context
    setUser({});

    //Navigate back to startpage
    navigate('/');
  }

  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })).json();

      // Set new accesstoken to user
      setUser({
        accesstoken: result.accessToken,
      });

      // Stop loading
      setLoading(false);
    }

    checkRefreshToken();
  }, [])

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="App w-100 d-flex flex-column justify-content-center align-items-center">
        <Navigation logOutCallback={logoutCallback} />
        
        <header className="p-2 d-flex justify-content-center align-items-center">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div className="container bg-white rounded mb-5">
          {loading
            ? <Loading />
            : <Routes id="router">
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/protected" element={<Protected />} />
                <Route path="/" element={<Content />} />
              </Routes>
          }
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;