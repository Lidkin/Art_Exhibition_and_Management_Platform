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

export const AppContext = createContext(null);
export const UserContext = createContext(null);

function App() {
  const [userToken, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null); //used in Profile
  return (
    <AppContext.Provider value={{ userToken, setToken }}>
       <UserContext.Provider value={{ userRole, setUserRole }}> 
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage title="Home" />} />
            <Route path="/login" element={<LoginRegister title="Login" />} />
            <Route path="/register" element={<LoginRegister title="Register" />} />
            <Route path="/profile" element={<Auth><Profile title="Profile" /></Auth>} />
            <Route path="/artist/*" element={<Auth><Artist title="Artist" /></Auth>} />
            <Route path="/curator/*" element={<Auth><Curator title="Curator" /></Auth>} />
          </Routes>
        </div>
       </UserContext.Provider> 
    </AppContext.Provider>
  );
}

export default App;
