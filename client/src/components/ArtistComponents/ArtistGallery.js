import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Container, CircularProgress,
    Checkbox, Card,
    CardContent, FormControlLabel,
    CardHeader, Grid
} from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { ActiveOpencallContext, ArtInOpencallContext } from "../Artist";
import usePrevious from "../../hooks/usePrevious";
import ChangeArtInfo from "./ChangeArtInfo";
import OpencallInfo from "./OpencallInfo";
import '../../styles/Artist.style.css';
import { useNavigate } from "react-router-dom";

function ArtistGallery(props) {
    const [itemData, setItemdata] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [forSubmitImages, setSubmitImages] = useState([]);
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const { artInOpencall, setArtInOpencall } = useContext(ArtInOpencallContext);
    const [selectedCard, setSelectedCard] = useState('');
    const [approvedArt, setApprovedArts] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [message, setMessage] = useState('');
    const [cardOfOpencall, setCardOfOpencall] = useState({});
    const prevOpencallContext = usePrevious(opencallContext);

    const navigate = useNavigate();


    const handleCardHover = (index) => {
        setSelectedCard(index);
    };

    const handleCardLeave = () => {
        setSelectedCard('');
    };

    useEffect(() => {

       const getAllArtImages = async () => {
            try {
                const res = await axios.get("/api/gallery/allimages");
                if (res.status === 200) {
                    console.log("images", res.data);
                    setItemdata(res.data);
                    const ids = res.data.map(item => item.id); //array of images
                    setArtInOpencall({ ...artInOpencall, allArt: ids });
                    const resArt = await axios.get(`/api/gallery/artinopencall?imageIds=${ids}&status=approved,submitted`);
                    if (resArt.status === 200) { 
                        const opencallIds = resArt.data;
                        setArtInOpencall({ ...artInOpencall, inOpencall: opencallIds })
                    }
                    setLoading(false);
                };
                
            } catch (error) {
                console.log(error);
                setLoading(false);
            };
        };
        getAllArtImages();

        if ((prevOpencallContext === '' || prevOpencallContext) && prevOpencallContext.id !== opencallContext.id) {
            setSubmitImages([]);
            setMessage('');
        }
    }, [opencallContext, buttonClicked]);



    const handleOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //Choose artwork by clicking checkbox
    const toggleSubmit = (index) => {
        const updatedSubmittedImages = [...forSubmitImages]; //adding choosen images for submit
        if (updatedSubmittedImages.includes(index)) {
            updatedSubmittedImages.splice(updatedSubmittedImages.indexOf(index), 1);
        } else {
            updatedSubmittedImages.push(index);
        };

        const difference = updatedSubmittedImages.length - opencallContext.maxnumber; // value for checking limit of works for submition
        difference > 0 ? setMessage(`The maximum number of artworks allowed is ${opencallContext.maxnumber}. Please deselect ${difference} ${difference === 1 ? "artwork" : "artworks"} to meet this limit.`) : setMessage('');
        setSubmitImages(updatedSubmittedImages);
        setButtonClicked(false);
        console.log("max number of art", opencallContext.maxnumber, "for submit", updatedSubmittedImages.length, "message", message)
    };

  // submit artworks to opencall  
    const handleSelectClick = async () => {
        try {
            const selectedImageIds = forSubmitImages.map((index) => itemData[index].id);
            selectedImageIds.forEach(id => {
                addImage(id);
            });
            setButtonClicked(true);
            navigate('/');
            
        } catch (error) {
            console.log(error);
        }
    };

    // Add image to opencall - table 'opencall_image'
    const addImage = async (id) => {
        try {
        const res = await axios.post("/api/gallery/addimageopencall?status=submitted", {
            opencall_id: opencallContext.id,
            image_id: id
        });
        if (res.status === 200) {
            console.log("Success")
            };
        } catch (error) {
            console.log(error);
        }
    };

    //check if image was submit
    const isImageSubmitted = (index) => {
        return buttonClicked && forSubmitImages.includes(index);
    };

    const alredyInOpencall = (item) => { 
        const alredySubmitted = item.opencall_info.map(item => {
            if (item.image_status === null) return false;
            return (item.image_status.includes('submitted') || item.image_status.includes('approved'))
        })
        console.log("item in opencall", alredySubmitted.includes(true));
        return alredySubmitted.includes(true);
    }

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                    <div id="arts-container">
                        {opencallContext.name && message === '' ? <Button onClick={handleSelectClick}>Send art to Opencall {opencallContext.name}</Button> : <h2>{message}</h2>}
                        <Container fixed sx={{marginBottom: '50px'}}>
                        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} rowSpacing={2}>
                            {itemData.map((item, index) => (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                        <Card key={item.id}
                                            sx={{ height: "100%", width: "100%" }}
                                            onMouseEnter={() => handleCardHover(index)}
                                        onMouseLeave={() => handleCardLeave()}>
                                        <CardContent>
                                                {selectedCard !== index ? <CardHeader title={item.name} /> : <ChangeArtInfo value={{ item, selected: selectedCard === index }} />}
                                            </CardContent>
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
                                            {opencallContext.name && 
                                                <FormControlLabel                                               
                                                    key={item.id}
                                                    control={<Checkbox
                                                        checked={forSubmitImages.includes(index)}
                                                        onChange={() => toggleSubmit(index)}
                                                        disabled={alredyInOpencall(item)}
                                                        // disabled={isImageSubmitted(index) ? true : false}
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

                    </Container>
                </div>
            )}
        </>
    );
};

export default ArtistGallery;