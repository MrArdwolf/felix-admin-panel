import './App.scss'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from './pages/SignUpPage/SignUpPage';
import FormPage from './pages/FormPage/FormPage';
import HomePage from './pages/HomePage/HomePage';
import PartsPage from './pages/PartsPage/PartsPage';
import CustomerPage from './pages/CustomerPage/CustomerPage';
import ArchivedPage from './pages/ArchivedPage/ArchivedPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import Header from './components/Header/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AlertModal from './components/AlertModal/AlertModal';

export default function App() {

  axios.defaults.withCredentials = true;

  const backend = import.meta.env.VITE_API_URL
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState();

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: ''
  });

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = (req) => {
    axios.get(`${backend}/api/user/auth/authenticate`)
      .then(res => {
        console.log(res.data);
        setUser(res.data.user)
        setIsLoading(false);
        if (req) {
          req();
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status !== 401) {
          setUser(null)
          setIsLoading(true);
          setAlert({
            show: true,
            message: `Serverfel. Försök igen senare`,
            type: "error"
          })
        } else {
          setUser(null)
          setIsLoading(false);
        }
      })
  }

  const colseAlert = () => {
    setAlert({ ...alert, show: false })
  }

  return (
    <BrowserRouter>
      <Header user={user} />
      <AlertModal show={alert.show} message={alert.message} type={alert.type} colseAlert={colseAlert} />
      {isLoading ? <p>Server fel. Försök igen senare</p> :
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/auth" element={<SignUpPage setAlert={setAlert} setUser={setUser} />} />
          <Route path="/form" element={<FormPage setAlert={setAlert} />} />
          <Route path="/parts" element={<PartsPage authenticate={authenticate} user={user} setAlert={setAlert} />} />
          <Route path="/customers" element={<CustomerPage authenticate={authenticate} user={user} setAlert={setAlert} />} />
          <Route path="/archive" element={<ArchivedPage authenticate={authenticate} user={user} />} />
          <Route path="/logout" element={<LogoutPage setAlert={setAlert} />} />
        </Routes>
      }
    </BrowserRouter>
  )




}
