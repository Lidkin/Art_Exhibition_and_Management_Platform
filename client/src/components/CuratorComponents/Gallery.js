import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    CircularProgress, Checkbox, Chip,
    Card, CardContent, Container, Grid, Badge
} from "@mui/material";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'; // aprove option
import Favorite from '@mui/icons-material/Favorite'; //aproved
import UnpublishedIcon from '@mui/icons-material/Unpublished'; //rejected
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined'; //reject option
// import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'; //empty gallery
import CircleIcon from '@mui/icons-material/Circle'; //sold 
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; // sale option
import HailIcon from '@mui/icons-material/Hail';  // artwork returned
import CollectionsIcon from '@mui/icons-material/Collections';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import { OpencallContext } from "../Curator";


function Gallery(props) {
    const [itemData, setItemdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [favoriteImages, setFavoriteImages] = useState([]);
    const [rejectedImages, setRejectedImages] = useState([]);
    const [soldImages, setSoldImages] = useState([]);
    const [returnedImages, setReturnedImages] = useState([]);
    const [countOfArt, setCountOfArt] = useState();
    const { opencallInfo, setOpencallInfo } = useContext(OpencallContext);
    const navigate = useNavigate();
    const { title } = useParams();

    useEffect(() => {
        const getAllArtImages = async () => {
            try {
                const status = title === "gallery" ? "approved,returned,sold" : "submitted";
                const res = await axios.get(`/api/opencall/byopencall?opencallId=${opencallInfo.id}&status=${status}`);
                if (res.status === 200) {
                    setItemdata(res.data); // full info about artworks
                    setLoading(false);
                };

                if (title == "submitted") {
                    console.log("opencall id", opencallInfo.id);
                    const countArt = await axios.get(`/api/opencall/countart?opencallId=${opencallInfo.id}&status=approved,returned,sold`);
                    if (countArt.status === 200) {
                        const count = countArt.data[0].count;
                        setCountOfArt(Number.parseInt(count));
                    }
                 }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        if (opencallInfo && opencallInfo.id !== null) getAllArtImages();

    }, [title]);

    const handleOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleIcon = (index, event) => {
        const iconId = event.target.id;
        const updatedSelectedImages = imagesArray(iconId);
        if (updatedSelectedImages.includes(index)) {
            updatedSelectedImages.splice(updatedSelectedImages.indexOf(index), 1);
        } else {
            updatedSelectedImages.push(index);
        }
        console.log("id", iconId, "selected image", updatedSelectedImages)
        switch (iconId) {
            case "Favorite":
                setFavoriteImages(updatedSelectedImages);
                break;
            case "Reject":
                setRejectedImages(updatedSelectedImages);
                break;
            case "Sold":
                setSoldImages(updatedSelectedImages);
                break;
            case "Returned":
                setReturnedImages(updatedSelectedImages);
                break;
        };
    }

    const imagesArray = (iconId) => {
        switch (iconId) {
            case "Favorite":
                return [...favoriteImages];
            case "Reject":
                return [...rejectedImages];
            case "Sold":
                return [...soldImages];
            case "Returned":
                return [...returnedImages];
        };
    };

    const handleSelectClick = async () => {
        try {
            if (title !== "gallery") {
                const selectedFavImageIds = favoriteImages.map((index) => itemData[index].id);
                const selectedRejImageIds = rejectedImages.map((index) => itemData[index].id);

                const resFav = selectedFavImageIds.length > 0 && await axios.patch(`/api/opencall/artstatus?status=approved&imageIds=${selectedFavImageIds}&opencallId=${opencallInfo.id}`);
                const resRej = selectedRejImageIds.length > 0 && await axios.patch(`/api/opencall/artstatus?status=rejected&imageIds=${selectedRejImageIds}&opencallId=${opencallInfo.id}`);
                if (resRej.status === 200) {
                    navigate('../opencall')
                    console.log(resRej.data)
                };
                if (resFav.status === 200) {
                    navigate('../opencall');
                };
            } else {
                const selectedSoldImageIds = soldImages.map((index) => itemData[index].id);
                const selectedRetImageIds = returnedImages.map((index) => itemData[index].id);

                const resSold = selectedSoldImageIds.length > 0 &&
                    await axios.patch(`/api/opencall/artstatus?status=sold&imageIds=${selectedSoldImageIds}&opencallId=${opencallInfo.id}`);
                if (resSold.status === 200) {
                    createMessage(selectedSoldImageIds, "sold");
                    navigate('../opencall');
                };
                const resRet = selectedRetImageIds.length > 0 &&
                    await axios.patch(`/api/opencall/artstatus?status=returned&imageIds=${selectedRetImageIds}&opencallId=${opencallInfo.id}`);
                if (resRet.status === 200) {
                    createMessage(selectedRetImageIds, "returned");
                    navigate('../opencall');
                };
            };
        } catch (error) {
            console.log(error);
        };
    };

    const createMessage = async (ids, statusImg) => {
        try {
            console.log("ids=>", ids, "status Img", statusImg);
            //const res = await axios.patch();
        } catch (error) {
            
        }
    };

    const goToGallery = async() => { 
        navigate('../opencall/gallery');
    }

    return (itemData.length === 0 ? (
        <div>
            {opencallInfo ? <h2>{title === "gallery" ? "Aproved artworks in " : "Submitted artworks to"} {opencallInfo.name}</h2> : navigate('../opencall')}           
            {/* <Chip label="Go To Gallery" onClick={goToGallery} /> */}
            <Badge badgeContent={countOfArt} color="error">
                <Chip label="Go To Gallery" onClick={goToGallery} sx={{ fontSize:25, padding:"2ch" }} /> 
                    {/* <CollectionsIcon sx={{ color: "rgb(0, 0, 0)" }} /> */}
            </Badge>
        </div>
    ) : (         
            <>
                {opencallInfo ? <h2>{title === "gallery" ? "Aproved artworks in " : "Submitted artworks to"} {opencallInfo.name}</h2> : navigate('../opencall')}
                {
                    loading ? (
                        <CircularProgress />
                    ) : (
                        <Container fixed sx={{ marginBottom: '50px' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} rowSpacing={2}>
                                {itemData.map((item, index) => (
                                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                        <Card key={index} sx={{ height: "100%", width: "100%" }}>
                                            <Container maxWidth="sm" key={item.url} onClick={() => handleOpen(item.url)}>
                                                <img
                                                    width="100%"
                                                    height="250px"
                                                    style={{
                                                        objectFit: "contain" // "contain" or "cover" 
                                                    }}
                                                    srcSet={`${item.url}?w=250&h=250&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${item.url}?w=250&h=250&fit=crop&auto=format`}
                                                    alt={item.name}
                                                    loading="lazy"
                                                />
                                            </Container>
                                            <CardContent>
                                                {!rejectedImages.includes(index) && <Checkbox
                                                    id={title === "gallery" ? "Sold" : "Favorite"}
                                                    icon={title === "gallery" ? <CircleOutlinedIcon /> : <FavoriteBorder />}
                                                    checkedIcon={title === "gallery" ? <CircleIcon sx={{ color: "rgb(250,0,0)" }} /> : <Favorite sx={{ color: "rgb(250,0,0)" }} />}
                                                    checked={title === "gallery" ? soldImages.includes(index) : favoriteImages.includes(index)}
                                                    onChange={(event) => toggleIcon(index, event)}
                                                    inputProps={{ 'aria-label': 'controlled' }} />}
                                                {!favoriteImages.includes(index) && <Checkbox
                                                    id={title === "gallery" ? "Returned" : "Reject"}
                                                    icon={title === "gallery" ? <HailIcon /> : <UnpublishedOutlinedIcon />}
                                                    checkedIcon={title === "gallery" ? <HailIcon sx={{ color: "rgb(0,250,0)" }} /> : <UnpublishedIcon sx={{ color: "rgb(0,0,0)" }} />}
                                                    checked={title === "gallery" ? returnedImages.includes(index) : rejectedImages.includes(index)}
                                                    onChange={(event) => toggleIcon(index, event)}
                                                    inputProps={{ 'aria-label': 'controlled' }} />}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
                        </Container>
                    )}
                <Button onClick={handleSelectClick}>Сonfirm Selection</Button>
            </>        
        )
                                
    );
};

export default Gallery;