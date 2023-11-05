import { useState, useRef, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import { Box, TextField, Button, Grid, Stack, ButtonGroup } from "@mui/material";
import { styled } from '@mui/material/styles';
import CalendarComp from "../CalendarComp";
import DateRangeComp from "../DateRangeComp";
import { DateContext, DateRangeContext } from '../Contexts';
import '../../styles/Curator.style.css';

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

function AddOpencall(props) {
    const [openCall, setOpencall] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const { dateValue, setDateValue } = useContext(DateContext);
    const { dates, setDates } = useContext(DateRangeContext);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOpencall({ ...openCall, [name]: value });
    };

    const handleCancel = () => {
        setDates([]);
        setDateValue('');
        setOpencall({});
        setPreviewImage(null);
        setSelectedImage(null);
        setIsEditing(false);
        navigate("./opencall");
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            if (file.size <= 2000000) {
                setSelectedImage(file);
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert("File size exceeds the limit (2MB).");
            };
        }
    };

    const handleUploadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleClick = async () => {
        try {
            const formData = new FormData();
console.log("image",selectedImage);
            if (selectedImage !== null) formData.append("file", selectedImage);
            for (const key in openCall) {
                formData.append(key, openCall[key]);
            }
            formData.append("deadline", dateValue);
            formData.append("date", `[${dates})`);

            console.log("form data",formData);
            const res = await axios.patch("/api/opencall/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                setDates([]);
                setDateValue('');
                setOpencall({});
                setPreviewImage(null);
                setSelectedImage(null);
                setIsEditing(false);
                navigate("./opencall");
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
                <>
                    <Button className="button"
                        variant="contained"
                        startIcon={<AddPhotoAlternateTwoToneIcon />}
                        onClick={handleUploadButtonClick}
                    >
                        Upload poster
                    </Button>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .MuiTextField-root': { width: '25ch' },
                            alignItems: "center"
                        }}
                    >
                        <VisuallyHiddenInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ maxWidth: "50%", height: "auto", alignContent: "center" }}
                            />
                        )}

                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={openCall.name}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Fee"
                                        name="fee"
                                        value={openCall.fee}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={openCall.description}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Max number of works"
                                        name="maxnumber"
                                        value={openCall.maxnumber}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Status"
                                        name="status"
                                        value={openCall.status}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Max width"
                                        name="max_width"
                                        value={openCall.max_width}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Max height"
                                        name="max_height"
                                        value={openCall.max_height}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />

                                </>
                            </Grid>
                        </Grid>
                        <Stack spacing={2} direction="row">
                            <div className="dates"><h3>Deadline</h3><CalendarComp /></div>
                            <div className="dates"><h3>Dates</h3><DateRangeComp /></div>
                        </Stack>
                    </Box>
                </>
            ) : null}
            <div>
                {isEditing ? (
                    <>
                        <Button className="button" variant="contained" onClick={handleClick}>
                            Save
                        </Button>
                        <Button className="button" variant="contained" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ) : (

                    <Button className="button" variant="contained" onClick={handleEditClick}>
                        Add Opencall
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AddOpencall;