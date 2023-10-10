import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Container, Paper, Grid, TextField, Button } from '@mui/material';
import { UserContext } from '../App';

const Profile = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const { setRole } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const profile = async () => {
            try {
                const res = await axios.get("api/profile/user");
                if (res.status === 200) {
                    setUser(res.data[0]);
                    setLoading(false);
                };
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        profile();
    }, [user]);

    const handleEditClick = () => {
        setIsEditing(true);
        setUpdatedUser(user);
    };
    
    const handleSaveClick = async () => {
        try {
            const res = await axios.patch("/api/profile/update", updatedUser);
            if (res.status === 200) {
                setUser(res.data);
                setIsEditing(false);
                setRole(updatedUser.role);
                navigate("/profile");
            };
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    return (
        <Container>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '16px' }}>
                            <Typography variant="h4" gutterBottom>
                                Profile
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Name: {`${user.firstname} ${user.lastname}`}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Email: {user.email}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Info: {user.info}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Role: {user.role}
                            </Typography>
                            {isEditing ? (
                                <>
                                    <TextField
                                        label="Firstname"
                                        name="firstname"
                                        value={updatedUser.firstname}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Lastname"
                                        name="lastname"
                                        value={updatedUser.lastname}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={updatedUser.email}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Info"
                                        name="info"
                                        value={updatedUser.info}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Role"
                                        name="role"
                                        value={updatedUser.role}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                </>
                            ) : null}
                            <div>
                                {isEditing ? (
                                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handleEditClick}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Profile;