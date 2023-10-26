import React, { useEffect, useState } from "react";
import axios from "axios";
import { Collapse, Dialog, DialogTitle, DialogActions, DialogContent, List, ListItemText, Button, ListItemButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function OpencallInfo(props) {
    const id = props.value.item.id;
    const [isEditing, setIsEditing] = useState(false);
    const [opencallInfo, setOpencallInfo] = useState('');
    const [open, setOpen] = useState(false);
    const [openList, setOpenList] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setIsEditing(false);
        setOpen(true);
    };

    const handleClick = () => {
        setOpenList(!openList);
    };

    useEffect(() => {
        const getOpencalls = async () => {
            try {
                const res = await axios.get(`/api/opencall/byimage?id=${id}`);
                console.log("id", id);
                if (res.status === 200) {
                    setOpencallInfo(res.data);
                };
            } catch (error) {
                console.log(error);
            }
        };
        getOpencalls();
    }, [id]);

    return (
        <>
            {props.value.selected && <Button sx={{ margin: "12px" }} variant="outlined" onClick={handleClickOpen}>
                Opencalls
            </Button>}
            <Dialog
                width="100vw"
                open={open}
                onClose={handleClose}>
                <DialogTitle>Opencall List:</DialogTitle>
                {console.log("info", opencallInfo)}
                <DialogContent>
                    <List>
                        {opencallInfo && opencallInfo.map(opencall =>
                            <>
                                <ListItemButton onClick={handleClick}>
                                    <ListItemText primary={opencall.name} />
                                    {openList ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openList} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemText primary="Date: " secondary={opencall.date} />
                                        <ListItemText primary="Deadline: " secondary={opencall.deadline} />
                                        <ListItemText primary="Fee: " secondary={opencall.fee} />
                                        <ListItemText primary="Max count of works: " secondary={opencall.maxnumber} />
                                        <ListItemText primary="Description: " secondary={opencall.descriptios} />
                                    </List>
                                </Collapse>
                            </>
                        )}
                    </List>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OpencallInfo;

