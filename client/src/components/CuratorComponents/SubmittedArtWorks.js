import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    ImageList, ImageListItem, Box, CircularProgress, Checkbox,
    Card, CardContent
} from "@mui/material";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import { OpencallContext } from "../Curator";


function SubmittedArtworks(props) {
    const [itemData, setItemdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [favoriteImages, setFavoriteImages] = useState([]);
    const [rejectedImages, setRejectedImages] = useState([]);
    const { opencallInfo, setOpencallInfo } = useContext(OpencallContext);

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

    }, []);

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

    const toggleReject = (index) => {
        const updatedSelectedImages = [...rejectedImages];
        if (updatedSelectedImages.includes(index)) {
            updatedSelectedImages.splice(updatedSelectedImages.indexOf(index), 1);
        } else {
            updatedSelectedImages.push(index);
        }
        setRejectedImages(updatedSelectedImages);
    };

    const handleSelectClick = async () => {
        try {
            const selectedFavImageIds = favoriteImages.map((index) => itemData[index].id);
            const selectedRejImageIds = rejectedImages.map(index => itemData[index].id);

            const resFav = await axios.patch('/api/opencall/artstatus', { status: "approved", imageIds: selectedFavImageIds, opencallId: opencallInfo.id });
            const resRej = await axios.patch('/api/opencall/artstatus', { status: "rejected", imageIds: selectedRejImageIds, opencallId: opencallInfo.id });
            if (resFav.status === 200) {
                console.log(resFav.data)
            };
            if (resRej.status === 200) { console.log(resRej.data) };
        } catch (error) {
            console.log(error);
        }
    };

    return (itemData === null ? (
        <>
            <h2>Submitted artworks to {opencallInfo.name}</h2>
            <SentimentVeryDissatisfiedIcon />
        </>
    ) : (
        <>
            <h2>Submitted artworks to {opencallInfo.name}</h2>
            {
                loading ? (
                    <CircularProgress />
                ) : (
                    <Box sx={{ width: "fit-content", height: "70vh", overflowY: "scroll" }}>
                        <ImageList variant="masonry" cols={5} gap={20} >
                            {itemData.map((item, index) => (
                                <Card key={index} sx={{ height: "fit-content" }}>
                                    <CardContent>
                                        <ImageListItem key={item.url} onClick={() => handleOpen(item.url)}>
                                            <img
                                                srcSet={`${item.url}?w=200&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item.url}?w=200&fit=crop&auto=format`}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                        {!rejectedImages.includes(index) && <Checkbox
                                            icon={<FavoriteBorder />}
                                            checkedIcon={<Favorite sx={{ color: "#13770e" }} />}
                                            checked={favoriteImages.includes(index)}
                                            onChange={() => toggleFavorite(index)}
                                            inputProps={{ 'aria-label': 'controlled' }} />}
                                        {!favoriteImages.includes(index) && <Checkbox
                                            icon={<UnpublishedOutlinedIcon />}
                                            checkedIcon={<UnpublishedIcon color="error" />}
                                            checked={rejectedImages.includes(index)}
                                            onChange={() => toggleReject(index)}
                                            inputProps={{ 'aria-label': 'controlled' }} />}
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
            <Button onClick={handleSelectClick}>Сonfirm Selection</Button>
        </>
    )
    );
};

export default SubmittedArtworks;