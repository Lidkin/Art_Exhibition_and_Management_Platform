import { Link, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useContext } from "react";
import axios from "axios";

import { AppContext, UserContext } from "../App";

const Nav = (props) => {
    const { userToken, setToken } = useContext(AppContext);
    const { userRole, setRole } = useContext(UserContext);

    const navigate = useNavigate();

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
            {userRole === null ? (<Button component={Link} to="/login">
                Login
            </Button>) : null}
            {userRole === null ? (<Button component={Link} to="/register">
                Register
            </Button>) : null}

            {userRole !== null ? (<Button onClick={logout}>Logout</Button>) : null}
            {userRole !== null ? (<Button component={Link} to="/profile">
                Profile
            </Button>) : null}
            {userRole === 'artist' ? (<Button component={Link} to="artist/gallery">
                Gallery
            </Button>) : null}
            {userRole === 'curator' ? (<Button component={Link} to="/curator">
                Curator
            </Button>) : null}
        </Stack>
    );
};
export default Nav;
