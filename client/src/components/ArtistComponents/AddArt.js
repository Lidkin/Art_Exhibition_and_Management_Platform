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

function AddArt(props) {
    const [artImage, setArtimage] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArtimage({ ...artImage, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
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
            formData.append("file", selectedImage);
            for (const key in artImage) {
                formData.append(key, artImage[key]);
            }

            const res = await axios.post("/api/gallery/addimage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                setArtimage({});
                setPreviewImage(null);
                setSelectedImage(null);
                setIsEditing(false);
                navigate("artist/gallery");
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div className="addArt">
            {isEditing ? (
                <>
                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateTwoToneIcon />}
                        onClick={handleUploadButtonClick}
                    >
                        Upload image
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

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={artImage.name}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Price"
                                        name="price"
                                        value={artImage.price}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={artImage.description}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Year"
                                        name="creation_year"
                                        value={artImage.creation_year}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Width"
                                        name="width"
                                        value={artImage.width}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Height"
                                        name="height"
                                        value={artImage.height}
                                        onChange={handleInputChange}
                                        margin="normal"
                                    />
                                </>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            ) : null}
            <div>
                {isEditing ? (
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleEditClick}>
                        Add Art
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AddArt;