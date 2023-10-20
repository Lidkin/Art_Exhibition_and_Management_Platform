import { useState, useEffect } from "react";
import axios from "axios";
import { ImageList, ImageListItem, Box, CircularProgress } from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { ZoomIn } from "@mui/icons-material";
import React from 'react';

function CuratorGallery(props) {
    const [itemData, setItemdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        const getAllArtImages = async () => {
            try {
                const res = await axios.get("/api/gallery/");                
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
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

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <Box sx={{ width: "fit-content", height: "70vh", overflowY: "scroll" }}>
                    <ImageList variant="masonry" cols={5} gap={20} >
                        {itemData.map((item) => (
                            <ImageListItem key={item.url} onClick={() => handleOpen(item.url)}>
                                <img
                                    srcSet={`${item.url}?w=200&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.url}?w=200&fit=crop&auto=format`}
                                    alt={item.name}
                                    loading="lazy"
                                />
                                <IconButton className="zoom-icon">
                                    <ZoomIn />
                                </IconButton>
                            </ImageListItem>
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
            )}
        </>
    );
};

export default CuratorGallery;