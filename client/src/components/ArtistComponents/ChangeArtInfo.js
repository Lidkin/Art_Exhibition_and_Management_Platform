import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, InputLabel, Box, Container, Dialog, DialogTitle, DialogActions, DialogContent, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    display: "inline-flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    margin: "10px",
                    width: "100vw",
                    height: "auto"
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    size: "small",
                    width: "100vw",
                }
            }
        }
    },
});

function ChangeArtInfo(props) {
    const [artInfo, setArtInfo] = useState(props.value.item);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedArtInfo, setUpdatedArtInfo] = useState('');
    const [open, setOpen] = useState(false);
    //const [newArtInfo, setNewArtInfo] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = async () => {
        // const status = await axios.get(`api/gallery/status?id=${artInfo.id}`)
        setIsEditing(false);
        setOpen(true);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        //setUpdatedArtInfo(artInfo);
    };

    const handleSaveClick = async () => {
        try {
            updatedArtInfo.width === undefined && setUpdatedArtInfo(updatedArtInfo["width"] = artInfo.width);
            console.log("height: ", updatedArtInfo.height)
            updatedArtInfo.height === undefined && setUpdatedArtInfo(updatedArtInfo["height"] = artInfo.height);
            console.log("art info", updatedArtInfo);
            const res = await axios.patch(`/api/gallery/update?id=${artInfo.id}`, updatedArtInfo);
            if (res.status === 200) {
                const updatingArt = await axios.get(`/api/gallery/byid?image_id=${artInfo.id}`);
                if (updatingArt.status === 200) {
                    const data = updatingArt.data[0];
                    console.log("data", data);
                    console.log("artInfo after save", { ...data, opencall_info: artInfo.opencall_info });
                    setArtInfo({ ...data, opencall_info: artInfo.opencall_info })
                }
                setIsEditing(false);
            };
        } catch (error) {
            console.error('Error updating art info data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedArtInfo({ ...updatedArtInfo, [name]: value });
    };

    return (
        <>
            {props.value.selected && <Button sx={{ margin: "12px" }} variant="outlined" onClick={handleClickOpen}>
                Open Info
            </Button>}
            <Dialog

                width="100vw"
                open={open}
                onClose={handleClose}>

                <DialogTitle>Art Info</DialogTitle>
                <DialogContent>
                    <ThemeProvider theme={theme}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                            <Grid item xs={12}>
                                <Container>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        size="small"
                                        name="name"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.name}
                                        label={isEditing && artInfo.name}
                                        onChange={handleInputChange}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Grid item xs>
                                <Container>
                                    <InputLabel>Price</InputLabel>
                                    <TextField
                                        size="small"
                                        name="price"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.price}
                                        label={isEditing && artInfo.price}
                                        onChange={handleInputChange}

                                        inputProps={{ size: 1 }}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Grid item xs>
                                <Container>
                                    <InputLabel>Creation Year</InputLabel>
                                    <TextField
                                        size="small"
                                        name="creation_year"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.creation_year}
                                        label={isEditing && artInfo.creation_year}
                                        onChange={handleInputChange}

                                        inputProps={{ size: 1 }}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Grid item xs>
                                <Container>
                                    <InputLabel>Description</InputLabel>
                                    <TextField
                                        size="small"
                                        name="descriptionr"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.description}
                                        label={isEditing && artInfo.description}
                                        onChange={handleInputChange}

                                        inputProps={{ size: 1 }}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Grid item xs>
                                <Container>
                                    <InputLabel>Size:</InputLabel>

                                    <TextField
                                        size="small"
                                        name="width"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.width}
                                        label="width"
                                        onChange={handleInputChange}

                                        inputProps={{ size: 1 }}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />
                                    <TextField
                                        size="small"
                                        name="height"
                                        disabled={!isEditing}
                                        defaultValue={artInfo.height}
                                        label="height"
                                        onChange={handleInputChange}

                                        inputProps={{ size: 1 }}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#1a237e",
                                                fontWeight: "bold"
                                            },
                                        }}
                                    />

                                </Container>
                            </Grid>
                            <Grid item xs>
                                {
                                    artInfo.opencall_info.map((item, index) => {
                                        return (<Container key={index}>
                                            <InputLabel key={index}>Opencall: {item.opencall_name}</InputLabel>
                                            <TextField
                                                size="small"
                                                name="description"
                                                disabled
                                                defaultValue={item.image_status}
                                                inputProps={{ size: 1 }}
                                                sx={{
                                                    "& .MuiInputBase-input.Mui-disabled": {
                                                        WebkitTextFillColor: "#1a237e",
                                                        fontWeight: "bold"
                                                    },
                                                }}
                                            />
                                        </Container>)
                                    })
                                }
                            </Grid>

                        </Grid>
                    </ThemeProvider>


                </DialogContent>
                <DialogContent>





















                </DialogContent>
                <DialogActions>
                    {isEditing ? (
                        <Button variant="contained" color="primary" onClick={handleSaveClick}>
                            Save
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleEditClick}>
                            Edit Info
                        </Button>
                    )}
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChangeArtInfo;