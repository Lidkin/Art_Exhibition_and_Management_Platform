import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImageList, ImageListItem, Box, CircularProgress, Checkbox, Card, CardContent, FormControlLabel } from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import React from 'react';
import { ActiveOpencallContext } from "../Artist";

function ArtistGallery(props) {
    const [itemData, setItemdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [forSubmitImages, setSubmitImages] = useState([]);
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const [approvedArt, setApprovedArts] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);

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
    }, [itemData]);

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
        console.log("id from context", opencallContext[0].id);
        const res = await axios.post("/api/gallery/imageopencall", {
            opencall_id: opencallContext[0].id,
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
                       {opencallContext[0] && <Button onClick={handleSelectClick}>Send art to Opencall {opencallContext[0].name} {opencallContext[0].focused}</Button>}
                    <Box sx={{ width: "fit-content", height: "70vh", overflowY: "scroll" }}>
                        <ImageList variant="masonry" cols={5} gap={20} >
                            {itemData.map((item, index) => (
                                <Card sx={{ height: "fit-content" }}>
                                    <CardContent>
                                        <ImageListItem key={item.url} onClick={() => handleOpen(item.url)}>
                                            <img
                                                srcSet={`${item.url}?w=200&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item.url}?w=200&fit=crop&auto=format`}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                        {opencallContext[0] &&
                                            <FormControlLabel control={<Checkbox
                                                checked={forSubmitImages.includes(index)}
                                                onChange={() => toggleSubmit(index)}
                                                disabled={isImageSubmitted(index) ? true : false}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />}
                                                label={buttonClicked && isImageSubmitted(index) ? opencallContext[0].name : ""}
                                                labelPlacement="bottom"
                                            />}
                                    </CardContent>
                                </Card>
                            ))}
                        </ImageList>

                        <Dialog
                            maxWidth="lg"
                            open={open}
                            onClose={handleClose}>
                            <DialogTitle>Zoomed Image</DialogTitle>
                            <DialogContent>
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Zoomed Image"
                                        style={{ maxWidth: "fit-content", height: "80vh" }}
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