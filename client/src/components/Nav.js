import { Link, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { AppContext, UserContext } from "../App";

const Nav = (props) => {
    const { userToken, setToken } = useContext(AppContext);
    const { userRole } = useContext(UserContext);
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(role)
        const roleChanged = async () => {
            try {
                if (userRole === null) {
                    const res = await axios.get("/api/user/role");
                    if (res.status === 200) {
                        setRole(res.data);
                    } else {
                        setRole(null);
                        navigate("/");
                    }
                } else { 
                    setRole(userRole);
                };
            } catch (error) {
                setRole(null);
                console.log("user role", error);
            }
        };
        roleChanged();
    });

    const logout = async () => {
        try {
            const res = await axios.post("/api/user/logout", {
                headers: {
                    "access-token": null,
                    "refresh-token": null
                },
            });
            if (res.status === 200) {
                setToken(null);
                setRole(null);
                navigate("/");
            }
        } catch (err) {
            setToken(null);
            setRole(null);
            navigate("/login");
        }
    };

    return (
        <Stack spacing={2} direction={"row"}>
            <Button component={Link} to="/">
                Home
            </Button>
            {role === null ? (<Button component={Link} to="/login">
                Login
            </Button>) : null}
            {role === null ? (<Button component={Link} to="/register">
                Register
            </Button>) : null}

            {role !== null ? (<Button onClick={logout}>Logout</Button>) : null}
            {role !== null ? (<Button component={Link} to="/profile">
                Profile
            </Button>) : null}
            {role === 'artist' ? (<Button component={Link} to="artist/gallery">
                Gallery
            </Button>) : null}
            {role === 'curator' ? (<Button component={Link} to="curator/opencall">
                Opencall
            </Button>) : null}
        </Stack>
    );
};
export default Nav;
