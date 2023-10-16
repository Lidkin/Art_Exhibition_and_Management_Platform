import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt from 'jwt-decode';
import { AppContext } from "../App";

export const Auth = (props) => {

    const { userToken, setToken } = useContext(AppContext); 
    const [redirect, setRedirect] = useState(null);
    const navigate = useNavigate();
    let intervalId;

    const isAccessTokenExpired = () => {

        if (!userToken.token) {
            return true;
        }

        try {
            const decodedToken = jwt(userToken.token);
            console.log("username=>",decodedToken.username);
            if (!decodedToken || !decodedToken.exp) {
                return true;
            }
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            return decodedToken.exp < currentTimeInSeconds;
        } catch (error) {
            console.log("in Auth -access token expired",error);
            return true;
        }
    }

    const refreshAccessToken = async () => {
        try {
            const res = await axios.get("/api/user/verify", {
                headers: {
                    "refresh-token": userToken?.refreshToken,
                    "time-expired": true
                },
            });
            if (res.status === 200) {
                console.log("refresh-token",res.data)
                setToken(res.data.token);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get("/api/user/verify", {
                    headers: {
                        "access-token": userToken?.token
                    },
                });
                if (res.status === 200) {
                    setRedirect(true);
                    }

            } catch (err) {
                setToken(null);
                navigate("/login");
            }
        };
        verify();

        const checkTokenExpiration = () => {
            if (isAccessTokenExpired()) {
                refreshAccessToken();
            }
        };

        intervalId = setInterval(checkTokenExpiration, 30000);
        return () => {
            clearInterval(intervalId);
        };
    }, [userToken]);

    return redirect ? props.children : null;
};