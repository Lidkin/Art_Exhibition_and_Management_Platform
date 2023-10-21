import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import { ToggleButtonGroup, ToggleButton, Button, Collapse, ListItemText, List, ListItemButton } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddOpencall from './AddOpencall';
import { OpencallContext } from "../Curator";

function Opencall(props) {
    const [opencalls, setOpencalls] = useState([]);
    const [opencallStatus, setOpencallStatus] = useState("active");
    const [artImage, setArt] = useState({});
    const [openItemIndex, setOpenItemIndex] = useState(-1);
    const [alignment, setAlignment] = useState('active');
    const { opencallInfo, setOpencallInfo } = useContext(OpencallContext);

    const navigate = useNavigate();

    useEffect(() => {
        const opencallsList = async () => {
            let opencallArr = null;
            try {
                const res = await axios.get('/api/opencall?status=active');
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
            const res = currentStatus === "all" ? await axios.get('/api/opencall/all') : await axios.get(`/api/opencall/?status=${currentStatus}`);
            if (res.status === 200) {
                setOpencalls(res.data);
                setOpencallStatus(currentStatus);
            };
        } catch (error) {
            console.log(error);
        };
    };

    const handleOpencall = (e) => {
        console.log(e.target.value);
        const arrOpencall = e.target.value.split(',');
        setOpencallInfo({ name: arrOpencall[0], id:arrOpencall[1]});
        navigate("gallery");
    };

    return (
        <>
            <AddOpencall />
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
                <List sx={{ width: '100%', maxWidth: '90vw', bgcolor: 'background.paper' }}>
                    {opencalls.map((item, index) => (
                        <div key={index}>
                            <ListItemButton onClick={() => handleListClick(index)}>
                                <ListItemText primary={item.name} />
                                {openItemIndex === index ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {Object.keys(item).map((key, subIndex) => {
                                        if (key === 'name') {
                                            return null;
                                        }; // Skip the 'name' property
                                        if (key === 'id') {
                                            return (<Button value={[item["name"],item["id"]]} onClick={(e) => handleOpencall(e)}>Gallery</Button>);                                        }
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
        </>
    );
};

export default Opencall;