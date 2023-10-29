import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, InputLabel, FormControl, Select, Box } from "@mui/material";
import { ActiveOpencallContext } from "../Artist";
import './Artist.style.css';

function ChooseOpencall(props) {
    const [activeOpencall, setOpencall] = useState([]);
    const [listActiveOpencalls, setListOpencalls] = useState('');
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const [show, setShow] = useState(false);

    const handleHide = () => {
        setShow(false);
        setOpencallContext({});
        setOpencall([]);
    };

    const handleShow = () => {
        setShow(true);
    };

    useEffect(() => {
        const getActiveOpencalls = async () => {
            try {
                const res = await axios.get("/api/opencall/status?status=active");
                console.log("active opencalls", res.data);
                if (res.status === 200) {
                    console.log("data",res.data);
                    const arrOpencalls = res.data.map((item) => { return { name: item.name, id: item.id } });
                    console.log("array opencalls",arrOpencalls);
                    setListOpencalls(arrOpencalls);
                };
            } catch (error) {
                console.log(error);
            };
        };
        getActiveOpencalls();
    }, []);


    const handleChange = (event) => {
        const { options } = event.target;
        const value = [];
        let contextOpencall;
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                const opencall = listActiveOpencalls.find((item) => item.id == options[i].value)
                value.push(options[i].value);
                console.log("list active opencalls",listActiveOpencalls);
                console.log(" from list opencalls", opencall);
                contextOpencall = { ...opencallContext, ...opencall };
            }
        }

        setOpencall([...activeOpencall, ...value]);
        setOpencallContext(contextOpencall);
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
                        {!show ? <Button sx={{ display: 'block', mt: 2 }} onClick={handleShow}>
                            Show Opencalls
                        </Button> : <Button sx={{ display: 'block', mt: 2 }} onClick={handleHide}>
                            Hide Opencalls
                        </Button>}

                        {show && <FormControl sx={{ m: 1, minWidth: "15%", maxWidth: "fit-content", maxHeight: "fit-content(50%)" }}>
                            
                                <InputLabel shrink htmlFor="select-multiple-native">
                                    Choose Opencall
                                </InputLabel>
                            <Select
                                multiple
                                native
                                value={activeOpencall}
                                onChange={handleChange}
                                label="Choose Opencall"
                                inputProps={{
                                    id: 'select-multiple-native',
                                    }}
                                >
                                    {listActiveOpencalls.map((opencall) => (
                                        <option key={opencall.name} value={opencall.id}>
                                            {opencall.name}
                                        </option>
                                    ))}
                                </Select>
                            
                        </FormControl>}

                    </Box>
                ) : null}
        </>

    );
};

export default ChooseOpencall;