import React, { createContext, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import AddArt from './ArtistComponents/AddArt';
import ArtistGallery from './ArtistComponents/ArtistGallery';
import ChooseOpencall from './ArtistComponents/ChooseOpencall';

export const ActiveOpencallContext = createContext(null);
function Artist(props) {
    const [opencallContext, setOpencallContext] = useState([{}]);
    return (
        <ActiveOpencallContext.Provider value={{ opencallContext, setOpencallContext }}>
            <div className='artist'>
                <ChooseOpencall />
                <Routes>
                    <Route path="/gallery" element={<ArtistGallery title="Artist Gallery" />} />
                </Routes>
                <AddArt />
            </div>
        </ActiveOpencallContext.Provider>
    );
}

export default Artist;