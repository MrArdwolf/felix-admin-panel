import './App.scss'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SignUpPage from './pages/SignUpPage/SignUpPage';
import FormPage from './pages/FormPage/FormPage';
import HomePage from './pages/HomePage/HomePage';
import PartsPage from './pages/PartsPage/PartsPage';
import Header from './components/Header/Header';
import {  useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  // const location = useLocation();
  // const { pathname } = location;

  axios.defaults.withCredentials = true;

  const backend = import.meta.env.VITE_API_URL
  const [user, setUser] = useState({});

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = () => {
    axios.get(`${backend}/api/user/auth/authenticate`)
    .then(res => {
        console.log(res.data);
        setUser(res.data.user)
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          setUser(null)
        } 
      })
  }

  return (
    <BrowserRouter>
    <Header user={user}/>
      <Routes>
        <Route path="/" element={<HomePage user={user}/>} />
        <Route path="/auth" element={<SignUpPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/parts" element={<PartsPage authenticate={authenticate} user={user}/>} />
      </Routes>
    </BrowserRouter>
  )
}
