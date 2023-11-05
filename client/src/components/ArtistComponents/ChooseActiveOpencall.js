import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { InputLabel, FormControl, Select, Box, MenuItem } from "@mui/material";
import { ActiveOpencallContext, ArtInOpencallContext } from "../Artist";

function ChooseOpencall(props) {
    const [activeOpencall, setActiveOpencall] = useState('');
    const [listActiveOpencalls, setListOpencalls] = useState([]);
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const { artInOpencall, setArtInOpencall } = useContext(ArtInOpencallContext); // here income array of all user's art ids

    console.log("art in opencall", artInOpencall.inOpencall.length);

    useEffect(() => {
        const getActiveOpencalls = async () => {
            //show opencalls with status active when artist dont have his work
            try {
                const arrOpencalls = [];
                const opencallIds = artInOpencall.inOpencall.length > 0 ? artInOpencall.inOpencall.map(item => item.opencall_id) : '';
                console.log("opencall Ids",opencallIds);
                const res = await axios.get(`/api/opencall/list?status=active&opencallIds=${opencallIds}`);
                if (res.status === 200) {
                    arrOpencalls.push(res.data.map((item) => { return { name: item.name, id: item.id, maxnumber: item.maxnumber, width: item.max_width, height: item.max_height } }));
                    setListOpencalls(arrOpencalls[0]);
                }
            } catch (error) {
                console.log(error);
            };
        };
        if (artInOpencall.inOpencall.length > 0) getActiveOpencalls();
    }, [artInOpencall]);

    const handleChange = async (event) => {
        const id = event.target.value;
        if (id === '') {
            setOpencallContext({});
            setActiveOpencall('');
        } else {
            const opencall = listActiveOpencalls.find((item) => item.id == id);
            console.log(" from list opencalls", opencall);
            setActiveOpencall(opencall.id);
            setOpencallContext(opencall);
            const res = await axios.get(`/api/gallery/getids?opencall_id=${opencall.id}`);
            if (res.status === 200) { 
                const data = res.data;
                const imageIds = data.map(item => item.image_id);
                setArtInOpencall({ ...artInOpencall, inOpencall: imageIds })
            }
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