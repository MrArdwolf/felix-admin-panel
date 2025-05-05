import './App.scss'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from './pages/SignUpPage/SignUpPage';
import FormPage from './pages/FormPage/FormPage';
import {  useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {

  axios.defaults.withCredentials = true;

  const backend = import.meta.env.VITE_API_URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = () => {
    axios.get(`${backend}/api/user/auth/authenticate`)
    .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello World</h1>} />
        <Route path="/auth" element={<SignUpPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  )
}
