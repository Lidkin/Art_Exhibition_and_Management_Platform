import React, { useState, createContext } from 'react';
import { Routes, Route } from "react-router-dom";
import Opencall from './CuratorComponents/CuratorOpencall';
import Gallery from './CuratorComponents/Gallery';
import AddOpencall from './CuratorComponents/AddOpencall';
import { DateRangeContext } from './Contexts';
export const OpencallContext = createContext({});
export const ArtworksContext = createContext({});


function Curator(props) {
    const [opencallInfo, setOpencallInfo] = useState({});
    const [artworkInfo, setArtworkInfo] = useState({});
    const [dates, setDates] = useState([]);

    return (
        <div className='curator'>
            <OpencallContext.Provider value={{ opencallInfo, setOpencallInfo }}>
                <ArtworksContext.Provider value={{ artworkInfo, setArtworkInfo }}>
                    <DateRangeContext.Provider value={{ dates, setDates }}>
                        <AddOpencall />
                        <Routes>
                            <Route path="opencall" element={<Opencall title="Opencall" />} />
                            <Route path="opencall/:title" element={<Gallery />} />
                        </Routes>

                    </DateRangeContext.Provider>
                </ArtworksContext.Provider>
            </OpencallContext.Provider>
        </div>
    );
}

export default Curator;