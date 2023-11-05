import { useState, createContext } from "react";
import LoginRegister from "./components/LoginRegister.js";
import Artist from "./components/Artist.js";
import Curator from "./components/Curator.js";
import Profile from "./components/Profile.js";
import Nav from "./components/Nav.js";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage.js';
import { Auth } from "./auth/Auth";
import { DateContext } from './components/Contexts.js';
import { TableFooter } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';
import Container from "@mui/material/Container";

export const AppContext = createContext(null);
export const UserContext = createContext(null);

function App() {
  const [userToken, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null); //used in Profile
  const [dateValue, setDateValue] = useState('');

  return (
    <div className="App">
    <AppContext.Provider value={{ userToken, setToken }}>
      <UserContext.Provider value={{ userRole, setUserRole }}> 
        <DateContext.Provider value={{ dateValue, setDateValue }}>
          <header className="header">
            <Nav className="navigation" />
          </header>
          <div className="AppBody">
          <Routes>
            <Route path="/" element={<HomePage title="Home" />} />
            <Route path="/login" element={<LoginRegister title="Login" />} />
            <Route path="/register" element={<LoginRegister title="Register" />} />
            <Route path="/profile" element={<Auth><Profile title="Profile" /></Auth>} />
            <Route path="/artist/*" element={<Auth><Artist title="Artist" /></Auth>} />
            <Route path="/curator/*" element={<Auth><Curator title="Curator" /></Auth>} />
            </Routes>
          </div>
          <footer className="footer">
            <Container className="container" maxWidth="xl" fixed>Lidia Khait<CopyrightIcon sx={{ padding: "10px 0px" }} /></Container>
          </footer>
        </DateContext.Provider>
       </UserContext.Provider> 
    </AppContext.Provider>
  </div>

  );
}

export default App;
