import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import { Box, TextField, Button, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Location(props) {
    const [location, setLocation] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocation({ ...location, [name]: value });
    };

    const handleClick = async () => {
        try {
            const res = await axios.patch("/api/gallery/addimage", location);
            if (res.status === 200) {
                setLocation({});
                setIsEditing(false);
                navigate("/curator");
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div className="addOpencall">
            {isEditing ? (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            name="name"
                            value={location.name}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={location.address}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            label="Contact"
                            name="contact"
                            value={location.contact}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            label="Link"
                            name="link"
                            value={location.link}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            label="Info"
                            name="info"
                            value={location.info}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                    </Grid>
                </Grid>
            ) : null}
            <div>
                {isEditing ? (
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleEditClick}>
                        Add Open-Call
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Location;