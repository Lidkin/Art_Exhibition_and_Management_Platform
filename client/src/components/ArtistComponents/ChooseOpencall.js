import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, InputLabel, FormControl, Select, Box } from "@mui/material";
import { ActiveOpencallContext } from "../Artist";

function ChooseOpencall(props) {
    const [activeOpencall, setOpencall] = useState([]);
    const [activeOpencalls, setOpencalls] = useState([]);
    const { opencallContext, setOpencallContext } = useContext(ActiveOpencallContext);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const getActiveOpencalls = async () => {
            try {
                const res = await axios.get("/api/opencall/status?status=active");
                if (res.status === 200) {
                    const arrOpencalls = res.data.map((item) => { return { name: item.name, id: item.id } });
          
                    setOpencalls(arrOpencalls);
                };
            } catch (error) {
                console.log(error);
            };
        };
        getActiveOpencalls();
    }, []);


    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        const contextOpencall = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                const opencall = activeOpencalls.find((item) => item.id == options[i].value)
                value.push(options[i].value);
                contextOpencall.push(opencall);
            }
        }

        setOpencall(value);
        setOpencallContext(contextOpencall);
    };

    // const handleCheckboxFocus = () => {
        // const updOpencallContext = opencallContext;
        // updOpencallContext["focused"] = true;
        // setIsFocused(true);
        // setOpencallContext(updOpencallContext);
    // };

    // const handleBlur = () => {
        // const updOpencallContext = opencallContext;
        // updOpencallContext["focused"] = false;
        // setIsFocused(false);
        // setOpencallContext(updOpencallContext);
    // };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { width: '50ch' },
            alignItems: "center"
        }}>
            <FormControl sx={{ m: 1, minWidth: "fit-content", maxWidth: "fit-content", maxHeight: "fit-content(50%)" }}>
                <InputLabel shrink htmlFor="select-multiple-native">
                    Active Opencalls
                </InputLabel>
                <Select
                    multiple
                    native
                    value={activeOpencall}
                    onChange={handleChangeMultiple}
                    label="Active Opencalls"
                    inputProps={{
                        id: 'select-multiple-native',
                    }}
                    // onFocus={handleCheckboxFocus}
                    // onBlur={handleBlur}
                >
                    {activeOpencalls.map((opencall) => (
                        <option key={opencall.name} value={opencall.id}>
                            {opencall.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            {console.log(opencallContext)}
        </Box>

    );
};

export default ChooseOpencall;