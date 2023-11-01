import React, { useState, createContext } from 'react';
import { Routes, Route } from "react-router-dom";
//import SelectArt from './CuratorComponents/SelectArt';
import Opencall from './CuratorComponents/CuratorOpencall';
import CuratorGallery from './CuratorComponents/CuratorGallery';
import SubmittedArtworks from './CuratorComponents/SubmittedArtWorks';

export const OpencallContext = createContext(null);
export const ArtworksContext = createContext(null);

function Curator(props) {
    const [opencallInfo, setOpencallInfo] = useState(null);
    const [artworkInfo, setArtworkInfo] = useState(null);
    return (
        <OpencallContext.Provider value={{ opencallInfo, setOpencallInfo }}>
            <ArtworksContext.Provider value={{ artworkInfo, setArtworkInfo }}>
            <div className='curator'>
                <Routes>
                    <Route path="opencall" element={<Opencall title="Opencall" />} />
                    <Route path="opencall/submitted" element={<SubmittedArtworks title="Submitted Artworks" />} />
                    <Route path="opencall/gallery" element={<CuratorGallery title="Gallery" />} />
                </Routes>
                </div>
            </ArtworksContext.Provider>
        </OpencallContext.Provider>
    );
}

export default Curator;