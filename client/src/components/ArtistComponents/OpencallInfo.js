import React, { useEffect, useState } from "react";
import axios from "axios";
import { Collapse, Dialog, DialogTitle, DialogActions, DialogContent, List, ListItemText, Button, ListItemButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

function OpencallInfo(props) {
    const id = props.value.item.id;
    const [isEditing, setIsEditing] = useState(false);
    const [opencallInfo, setOpencallInfo] = useState('');
    const [open, setOpen] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [dbDate, setDate] = useState('');
    const [dbDeadLine, setDeadLine] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setIsEditing(false);
        setOpen(true);
    };

    const handleClick = (opencall) => {
        setOpenList(!openList);
        opencall.date !== null && formattedDate(opencall.date);
        opencall.deadline !== null && formattedDeadline(opencall.deadline);
    };

    const formattedDate = (dbDate) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        console.log("date",dbDate);
        const dateRange = dbDate
            .match(/\d{4}-\d{2}-\d{2}/g)
            .map(date => new Date(date));
        const formatDate = dateRange
            .map(date => date.toLocaleDateString("en-US", options))
            .join(" to ");
        setDate(formatDate);
    };

    const formattedDeadline = (dbDeadLine) => {
        const deadline = new Date(dbDeadLine);
        const formatDeadline = deadline.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
        setDeadLine(formatDeadline);
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
                <DialogContent>
                    <List>
                        {opencallInfo && opencallInfo.map(opencall =>
                            <>
                                <ListItemButton onClick={() => handleClick(opencall)}>
                                    <ListItemText primary={opencall.name} />
                                    {openList ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openList} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemText primary="Date: " secondary={dbDate} />
                                        <ListItemText primary="Deadline: " secondary={dbDeadLine} />
                                        <ListItemText primary="Fee: " secondary={opencall.fee} />
                                        <ListItemText primary="Max count of works: " secondary={opencall.maxnumber} />
                                        <ListItemText primary="Description: " secondary={opencall.description} />
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

