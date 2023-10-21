import React, { useState, createContext } from 'react';
import { Routes, Route } from "react-router-dom";
//import SelectArt from './CuratorComponents/SelectArt';
import Opencall from './CuratorComponents/CuratorOpencall';
import CuratorGallery from './CuratorComponents/CuratorGallery';

export const OpencallContext = createContext(null);

function Curator(props) {
    const [opencallInfo, setOpencallInfo] = useState({ });
    return (
        <OpencallContext.Provider value={{ opencallInfo, setOpencallInfo }}>
            <div className='curator'>
                <Routes>
                    <Route path="opencall" element={<Opencall title="Opencall" />} />
                    <Route path="opencall/gallery" element={<CuratorGallery title="Gallery" />} />
                </Routes>
            </div>
        </OpencallContext.Provider>
    );
}

export default Curator;