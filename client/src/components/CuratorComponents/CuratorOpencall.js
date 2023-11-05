import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import {
    ToggleButtonGroup, ToggleButton, Button, Collapse, ListItemText,
    List, ListItemButton, Stack, Divider, Container, Box
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { OpencallContext } from "../Curator.js";
import '../../styles/Curator.style.css';

function Opencall(props) {
    const [opencalls, setOpencalls] = useState([]);
    const [opencallStatus, setOpencallStatus] = useState("active");
    const [openItemIndex, setOpenItemIndex] = useState(-1);
    const [alignment, setAlignment] = useState('active');
    const { opencallInfo, setOpencallInfo } = useContext(OpencallContext);

    const navigate = useNavigate();

    useEffect(() => {
        const opencallsList = async () => {
            let opencallArr = null;
            try {
                const res = await axios.get('/api/opencall/status?status=active');
                if (res.status === 200) {
                    opencallArr = res.data;
                };
                setOpencalls(opencallArr);
            } catch (error) {
                console.log(error);
            }
        };
        if (opencallStatus === "active") opencallsList();
    }, [opencallStatus]);

    const formattedDate = (dbDate) => {
        console.log("not null", dbDate);
        const options = { year: "numeric", month: "long", day: "numeric" };
        const dateRange = dbDate
            .match(/\d{4}-\d{2}-\d{2}/g)
            .map(date => new Date(date));
        const formatDate = dateRange
            .map(date => date.toLocaleDateString("en-US", options))
            .join(" to ");

        return formatDate;
    };

    const formattedDeadline = (dbDeadLine) => {
        let formatDeadline = '';
        if (dbDeadLine !== null) {
            console.log("not null", dbDeadLine);
            const deadline = new Date(dbDeadLine);
            formatDeadline = deadline.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };
        return formatDeadline;
    };


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
            const res = currentStatus === "all" ? await axios.get('/api/opencall/all') : await axios.get(`/api/opencall/status?status=${currentStatus}`);
            if (res.status === 200) {
                setOpencalls(res.data);
                setOpencallStatus(currentStatus);
            };
        } catch (error) {
            console.log(error);
        };
    };

    const handleOpencall = (e) => {
        const arrOpencall = e.target.value.split(',');
        setOpencallInfo({ name: arrOpencall[0], id: arrOpencall[1] });
        navigate(`${e.target.id}`);
    };

    return (
        <Box sx={{maxHeight:"100ch"}}>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
            {/* <AddOpencall /> */}
            {/* </LocalizationProvider> */}
            <h2>Opencalls</h2>
            {/* <Button onClick={navigate('../addopencall')}>add opencall</Button> */}
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton className="toggleButton" value="all" onClick={(e) => opencallByStatus(e)}>all</ToggleButton>
                <ToggleButton className="toggleButton" value="active" onClick={(e) => opencallByStatus(e)}>active</ToggleButton>
                <ToggleButton className="toggleButton" value="inWork" onClick={(e) => opencallByStatus(e)}>in work</ToggleButton>
                <ToggleButton className="tpggleButton" value="ended" onClick={(e) => opencallByStatus(e)}>ended</ToggleButton>
            </ToggleButtonGroup>

            {opencalls && (
             
                <Container fixed>
                    <List sx={{ width: '100%', maxWidth: '90vw', bgcolor: 'background.paper' }}>
                        {opencalls.map((item, index) => (
                            <div key={index}>
                                <ListItemButton className="listbutton" key={index} onClick={() => handleListClick(index)}>
                                    <ListItemText className="listbutton" primary={item.name} />
                                    {openItemIndex === index ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {Object.keys(item).map((key, subIndex) => {
                                            if (item[key] === null) return null;
                                            if (key === 'name') {
                                                return null;
                                            }; // Skip the 'name' property
                                            if (key === 'id') {
                                                return (
                                                    <Stack direction="row" sx={{ justifyContent: "center" }} divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                                                        <Button className="button"
                                                            variant="contained" id="submitted" value={[item["name"], item["id"]]} onClick={(e) => handleOpencall(e)}>Submitted Artworks</Button>
                                                        <Button className="button"
                                                            id="gallery" value={[item["name"], item["id"]]} onClick={(e) => handleOpencall(e)}>Gallery</Button>
                                                    </Stack>);
                                            };
                                            return (
                                                
                                                    <ListItemButton sx={{ pl: 10 }} key={subIndex}>
                                                    <ListItemText className="itemtext" primary={`${key}`} secondary={item[key] !== null && (key === 'deadline' ? formattedDeadline(item[key]) :
                                                            key === "date" ? formattedDate(item[key]) : item[key])} />
                                                    </ListItemButton>
                                        
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            </div>
                        ))}
                    </List>
                </Container>

            )}
        </Box>
    );
};

export default Opencall;