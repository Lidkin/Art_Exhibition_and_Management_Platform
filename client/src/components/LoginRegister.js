import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { AppContext, UserContext } from "../App";

const LoginRegister = (props) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [navigateTo, setNavigateTo] = useState(null);

    const { setToken } = useContext(AppContext);
    const { setRole } = useContext(UserContext);

    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState('artist');

    useEffect(() => {
        if (navigateTo === 'artist') {
            navigate("/artist");
            setRole('artist');
        } else if (navigateTo === 'curator') {
            navigate("/curator");
            setRole('curator');
        }
    }, [navigateTo]); // Will run when navigateTo changes

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const handleAction = async () => {
        if (props.title === "Register") {
            try {
                const res = await axios.post("/api/user/register", {
                    firstname, lastname, email, role: selectedValue, info, username, password
                });
                if (res.status === 200) {
                    setMessage("");
                    navigate("/login");
                }
            } catch (err) {
                setMessage(err.response.data.msg);
            }
        } else {
            try {
                const res = await axios.post("/api/user/login", {
                    username,
                    password,
                });
                if (res.status === 200) {
                    try {
                        const profRes = await axios.get("/api/profile/user");
                        if (profRes.status === 200) {
                            setMessage("");
                            setNavigateTo(profRes.data[0].role);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    setMessage("");
                    setToken(res.data);             
                }
            } catch (err) {
                setMessage(err.response);
            }
        }
    };

    return (
        <div>            
            <h2>{props.title}</h2>
            {props.title === "Register" ? (
                <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete="off">
                    <TextField
                        sx={{ m: 1 }}
                        id="firstname"
                        type="text"
                        label="Enter first name"
                        variant="outlined"
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 1 }}
                        id="lastname"
                        type="text"
                        label="Enter last name"
                        variant="outlined"
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 1 }}
                        id="email"
                        type="email"
                        label="Enter email"
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 1 }}
                        id="info"
                        type="text"
                        label="Enter info"
                        variant="outlined"
                        onChange={(e) => setInfo(e.target.value)}
                    />
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="artist"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="artist" control={<Radio
                                checked={selectedValue === 'artist'}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'Artist' }}
                            />} label="Artist" />
                            <FormControlLabel value="curator" control={<Radio
                                checked={selectedValue === 'curator'}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': "Curator" }}
                            />} label="Curator" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        sx={{ m: 1 }}
                        id="username"
                        type="text"
                        label="Enter username"
                        variant="outlined"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 1 }}
                        id="password"
                        type="password"
                        label="Enter password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
            ) : (
                <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete="off">
                    <TextField
                        sx={{ m: 1 }}
                        id="username"
                        type="text"
                        label="Enter username"
                        variant="outlined"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 1 }}
                        id="password"
                        type="password"
                        label="Enter password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </Box>
            )}
                    <Button onClick={handleAction} variant="contained">
                        {props.title}
                    </Button>
                    <div>
                        <p>{message}</p>
                    </div>
    
        </div>
    );
};

export default LoginRegister;
