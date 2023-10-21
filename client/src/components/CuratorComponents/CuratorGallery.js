import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImageList, ImageListItem, Box, CircularProgress } from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import { OpencallContext } from "../Curator";


function CuratorGallery(props) {
    const [itemData, setItemdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { opencallInfo } = useContext(OpencallContext);

    useEffect(() => {
        const getAllArtImages = async () => {
            try {
                const res = await axios.get(`/api/gallery/byopencall?opencall_id=${opencallInfo.id}`);
                if (res.status === 200) {
                    setItemdata(res.data);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        if (opencallInfo.id !== null) getAllArtImages();
    }, [itemData]);

    const handleOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (itemData === "" ? (
        <>
            <h2>Gallery {opencallInfo.name}</h2>
            <h4>empty</h4>
        </>
    ) : (
        <>
            <h2>Gallery {opencallInfo.name}</h2>
            {
                loading ? (
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
    )
    );
};

export default CuratorGallery;