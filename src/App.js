import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/LogIn";
import Register from "./components/Register";
import Reset from "./components/ForgotPassword";
import {useEffect} from "react";
import autoDetectTheme from "./functions/autoDetectTheme";
import MoreInfo from "./components/MoreInfo";
import Profile from "./components/Profile";
import CreateEvent from "./components/CreateEvent";

function App() {

    useEffect(() => {
        autoDetectTheme()
        //window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => autoDetectTheme())
    }, []);

  return (
      <Router>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/createEvent" element={<CreateEvent/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/finalize" element={<MoreInfo />} />
            <Route path="*" element={<Navigate to={'/'}/>} />
          </Routes>
      </Router>
  );
}

export default App;
