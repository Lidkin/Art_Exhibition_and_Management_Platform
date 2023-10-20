import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { ToggleButtonGroup, ToggleButton, Button, Collapse, ListItemText, List, ListItemButton } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function Opencall(props) {
    const [opencalls, setOpencalls] = useState([]);
    const [opencallStatus, setOpencallStatus] = useState("active");
    const [artImage, setArt] = useState({});
    const [openItemIndex, setOpenItemIndex] = useState(-1);
    const [alignment, setAlignment] = useState('active');

    const checkGallery = async (id) => {
        const res = await axios.get(`/api/gallery/${id}`);
        if (res.status === 200) {
            setArt(res.data);
        };
    };

    useEffect(() => {
        const opencallsList = async () => {
            let opencallArr = null;
            try {
                const res = await axios.get('/api/opencall/:active');
                if (res.status === 200) {
                    opencallArr = res.data;
                };
                setOpencalls(opencallArr);
            } catch (error) {
                console.log(error);
            }
        };
        if (opencallStatus === "active") opencallsList();
    }, []);


    const handleListClick = (index) => {
        if (openItemIndex === index) {
            setOpenItemIndex(-1);
        } else {
            setOpenItemIndex(index);
        }
    };

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const opencallByStatus = async (e) => {
        try {
            const currentStatus = e.target.textContent;
            const res = currentStatus === "all" ? await axios.get('/api/opencall/all') : await axios.get(`/api/opencall/:${currentStatus}`);
            if (res.status === 200) {
                console.log(res.data);
                setOpencalls(res.data);
                setOpencallStatus(currentStatus);
            };
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <>
            <h2>Opencalls</h2>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value="all" onClick={(e) => opencallByStatus(e)}>all</ToggleButton>
                <ToggleButton value="active" onClick={(e) => opencallByStatus(e)}>active</ToggleButton>
                <ToggleButton value="inWork" onClick={(e) => opencallByStatus(e)}>in work</ToggleButton>
                <ToggleButton value="ended" onClick={(e) => opencallByStatus(e)}>ended</ToggleButton>
            </ToggleButtonGroup>

            {opencalls && (
                <List sx={{ width: '100%', maxWidth: '80vw', bgcolor: 'background.paper' }}>
                    {opencalls.map((item, index) => (
                        <div key={index}>
                            <ListItemButton onClick={() => handleListClick(index)}>
                                <ListItemText primary={item.name} />
                                {openItemIndex === index ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {Object.keys(item).map((key, subIndex) => {
                                        if (key === 'name') return null; // Skip the 'name' property
                                        if (key === 'id') return (<Button component={Link} to="curator/gallery" >Gallery</Button>);
                                        return (
                                            <ListItemButton sx={{ pl: 4 }} key={subIndex}>
                                                <ListItemText primary={`${key}: ${item[key]}`} />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </div>
                    ))}
                </List>
            )}

            <Button onClick={checkGallery}></Button>
        </>
    );
};

export default Opencall;