import React, { createContext, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import AddArt from './ArtistComponents/AddArt';
import ArtistGallery from './ArtistComponents/ArtistGallery';
import ChooseOpencall from './ArtistComponents/ChooseOpencall';

export const ActiveOpencallContext = createContext(null);
export const ArtInOpencall = createContext(null);
function Artist(props) {
    const [opencallContext, setOpencallContext] = useState({});
    const [artInOpencallContext, setArtInOpencallContext] = useState([]);
    return (
        <ActiveOpencallContext.Provider value={{ opencallContext, setOpencallContext }}>
            <ArtInOpencall.Provider value={{ artInOpencallContext, setArtInOpencallContext }}>
                <div className='artist'>
                    <ChooseOpencall />
                    <AddArt />
                    <Routes>
                        <Route path="/gallery" element={<ArtistGallery title="Artist Gallery" />} />
                    </Routes>
                </div>
            </ArtInOpencall.Provider>
        </ActiveOpencallContext.Provider>
    );
}

export default Artist;