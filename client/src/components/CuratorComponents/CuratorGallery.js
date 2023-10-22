import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImageList, ImageListItem, Box, CircularProgress, Checkbox, Card, CardContent } from "@mui/material";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
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
    const [favoriteImages, setFavoriteImages] = useState([]);
    const [rejectedArt, setRejectedArts] = useState(null);
    const { opencallInfo, setOpencallInfo } = useContext(OpencallContext);

    useEffect(() => {
        const getAllArtImages = async () => {
            try {
                const res = opencallInfo.imageid ? await axios.get(`/api/gallery/byid?image_id=${opencallInfo.imageid}`) : await axios.get(`/api/gallery/byopencall?opencall_id=${opencallInfo.id}`);
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

    }, [itemData, opencallInfo]);

    useEffect(() => {
        const changeImageStatus = async () => {
            try {
                const res = await axios.patch();
                if (res.status === 200) {
                }
            } catch (error) {
                console.log(error);
            };
        };
        if (rejectedArt !== null) changeImageStatus();
    }, [rejectedArt]);

    const handleOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleFavorite = (index) => {
        const updatedSelectedImages = [...favoriteImages];
        if (updatedSelectedImages.includes(index)) {
            updatedSelectedImages.splice(updatedSelectedImages.indexOf(index), 1);
        } else {
            updatedSelectedImages.push(index);
        }
        setFavoriteImages(updatedSelectedImages);
    };

    const handleSelectClick = async () => {
        const selectedImageIds = favoriteImages.map((index) => itemData[index].id);
        const updatedOpencallInfo = { ...opencallInfo, imageid: selectedImageIds };
        await setOpencallInfo(updatedOpencallInfo);
        const res = await axios.delete(`/api/gallery/reject?opencall_id=${opencallInfo.id}&image_id=${selectedImageIds}`);
        if (res.status === 200) {
            setRejectedArts(res.data);
        }
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
                                        <Checkbox
                                            icon={<FavoriteBorder />}
                                            checkedIcon={<Favorite />}
                                            checked={favoriteImages.includes(index)}
                                            onChange={() => toggleFavorite(index)}
                                            inputProps={{ 'aria-label': 'controlled' }} />
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
                )}
            <Button onClick={handleSelectClick}>Choose Favorite</Button>
        </>
    )
    );
};

export default CuratorGallery;