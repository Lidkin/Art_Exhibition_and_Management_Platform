import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Container, ImageListItem,
    Box, CircularProgress,
    Checkbox, Card,
    CardContent, FormControlLabel,
    CardHeader, Grid, ListItem, List, ListItemText
} from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { ActiveOpencallContext } from "../Artist";
import ChangeArtInfo from "./ChangeArtInfo";
import OpencallInfo from "./OpencallInfo";

const theme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '2px solid rgba(0, 0, 100, 0.25)',
                    borderRadius: '5px',
                    margin: "5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1px'
                }
            },
        },
    },
});

function ArtistGallery(props) {
    const [itemData, setItemdata] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [forSubmitImages, setSubmitImages] = useState([]);
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const [selectedCard, setSelectedCard] = useState('');
    const [approvedArt, setApprovedArts] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);


    const handleCardHover = (index) => {
        setSelectedCard(index);
    };

    const handleCardLeave = () => {
        setSelectedCard('');
    };

    useEffect(() => {
       const getAllArtImages = async () => {
            try {
                const res = await axios.get("/api/gallery/getimages");
                if (res.status === 200) {
                    setItemdata(res.data);
                    setLoading(false);
                };
            } catch (error) {
                console.log(error);
                setLoading(false);
            };
        };
        getAllArtImages();
    }, [itemData]); //itemData

    const handleOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleSubmit = (index) => {
        const updatedSubmittedImages = [...forSubmitImages];
        if (updatedSubmittedImages.includes(index)) {
            updatedSubmittedImages.splice(updatedSubmittedImages.indexOf(index), 1);
        } else {
            updatedSubmittedImages.push(index);
        }
        setSubmitImages(updatedSubmittedImages);
        setButtonClicked(false);
    };

    const handleSelectClick = async () => {
        try {
            const selectedImageIds = forSubmitImages.map((index) => itemData[index].id);
            selectedImageIds.forEach(id => {
                addImage(id);
            });
            const res = await axios.patch("/api/gallery/status", { status: "submitted", ids: selectedImageIds });
            if (res.status === 200) {
                setButtonClicked(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addImage = async (id) => {
        const res = await axios.post("/api/gallery/addimageopencall", {
            opencall_id: opencallContext.id,
            image_id: id
        });
        if (res.status === 200) {
            console.log("Success")
        };
    };

    const isImageSubmitted = (index) => {
        return buttonClicked && forSubmitImages.includes(index);
    };

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {opencallContext.name && <Button onClick={handleSelectClick}>Send art to Opencall {opencallContext.name}</Button>}
                    <Box className="gallery" sx={{ width: "100%", height: "65vh", overflowY: "scroll", boxShadow: '5px 0px 5px rgba(0, 10, 50, 0.5)', p: 2 }}>
                        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} rowSpacing={2}>
                            {itemData.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <ThemeProvider theme={theme}>
                                        <Card key={item.id}
                                            sx={{ height: "100%", width: "100%" }}
                                            onMouseEnter={() => handleCardHover(index)}
                                            onMouseLeave={() => handleCardLeave()}>
                                            {selectedCard !== index ? <CardHeader title={item.name} /> : <ChangeArtInfo value={{ item, selected: selectedCard === index }} />}

                                            <Container sx={{ width: "100%", height: "250px" }} key={item.url} onClick={() => handleOpen(item.url)}>
                                                <img
                                                    width="100%"
                                                    height="250px"
                                                    style={{
                                                        objectFit: "contain" // "contain" or "cover" 
                                                    }}
                                                    srcSet={`${item.url}??w=250&h=250&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${item.url}?w=250&h=250&fit=crop&auto=format`}
                                                    alt={item.name}
                                                    loading="lazy"
                                                />
                                            </Container>
                                            <CardContent key={item.id}>
                                                {item.status === null && opencallContext.name &&
                                                    <FormControlLabel
                                                        key={item.id}
                                                        control={<Checkbox
                                                            checked={forSubmitImages.includes(index)}
                                                            onChange={() => toggleSubmit(index)}
                                                            disabled={isImageSubmitted(index) ? true : false}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                        />}
                                                        label={buttonClicked && isImageSubmitted(index) ? opencallContext.name : ""}
                                                        labelPlacement="bottom"
                                                    />}
                                            </CardContent>
                                            <CardContent>
                                                {item.status === "submitted" && (selectedCard !== index ? <p>Submitted</p> : <OpencallInfo value={{ item, selected: selectedCard === index }} />)}
                                            </CardContent>
                                        </Card>
                                    </ThemeProvider>
                                </Grid>
                            ))}
                        </Grid>

                        <Dialog
                            maxWidth="lg"
                            minWidth="sx"
                            open={open}
                            onClose={handleClose}>
                            <DialogTitle>Zoomed Image</DialogTitle>
                            <DialogContent>
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Zoomed Image"
                                        style={{ maxWidth: "100%", maxHight: "100%" }}
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </>
            )}
        </>
    );
};

export default ArtistGallery;