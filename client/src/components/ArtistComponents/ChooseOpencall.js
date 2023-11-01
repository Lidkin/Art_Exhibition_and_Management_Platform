import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, InputLabel, FormControl, Select, Box, MenuItem } from "@mui/material";
import { ActiveOpencallContext, ArtInOpencall } from "../Artist";

function ChooseOpencall(props) {
    const [activeOpencall, setActiveOpencall] = useState('');
    const [listActiveOpencalls, setListOpencalls] = useState('');
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const { artInOpencallContext, setArtInOpencallContext } = useContext(ArtInOpencall); // here income array of all user's art ids

    useEffect(() => {
        const getActiveOpencalls = async () => {
            try {
                const arrOpencalls = [];
                const res = await axios.get("/api/opencall/status?status=active");
                if (res.status === 200) {
                    arrOpencalls.push(res.data.map((item) => { return { name: item.name, id: item.id, maxnumber: item.maxnumber, width: item.max_width, height: item.max_height } }));
                    console.log("opencalls", arrOpencalls[0]);
                    setListOpencalls(arrOpencalls[0]); //array of active opencalls
                };
                if (artInOpencallContext.length > 0) {
                    const resList = await axios.get(`/api/gallery/listopencalls?ids=${artInOpencallContext}`);
                    if (resList.status === 200) {
                        const opencallIds = resList.data;
                        console.log("ids of opencalls", opencallIds)
                        setArtInOpencallContext({ opencallIds: opencallIds }) // list of opencalls where arts was submit to

                        if (arrOpencalls.length > 0) {
                            const newArr = arrOpencalls[0].filter(obj => !opencallIds.includes(obj.id));
                            console.log("newArray",newArr)
                            setListOpencalls(newArr);
                        }
                    };
                }
                
            } catch (error) {
                console.log(error);
            };
        };
        getActiveOpencalls();
    }, [artInOpencallContext]);


    const handleChange = (event) => {
        const id = event.target.value;
        if (id === '') {
            setOpencallContext({});
            setActiveOpencall('');
        } else {
            const opencall = listActiveOpencalls.find((item) => item.id == id);
            console.log(" from list opencalls", opencall);
            setActiveOpencall(opencall.id);
            setOpencallContext(opencall);
        }
    };

    return (
        <>
            {listActiveOpencalls !== '' ?
                (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiTextField-root': { width: '50ch' },
                        alignItems: "center"
                    }}>
                        <FormControl id="chooseOpencall" variant="filled" sx={{ m: 1, minWidth: '45%' }}>

                            <InputLabel id="demo-simple-select-filled-label">
                                Choose Opencall
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={activeOpencall}
                                onChange={handleChange}
                                label="Choose Opencall"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {listActiveOpencalls.map((opencall) => (
                                    <MenuItem key={opencall.name} value={opencall.id}>
                                        {opencall.name}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>

                    </Box>
                ) : null}
        </>

    );
};

export default ChooseOpencall;