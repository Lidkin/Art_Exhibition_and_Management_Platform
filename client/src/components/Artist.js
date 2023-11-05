import React, { createContext, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import AddArt from './ArtistComponents/AddArt';
import ArtistGallery from './ArtistComponents/ArtistGallery';
import ChooseOpencall from './ArtistComponents/ChooseActiveOpencall';

export const ActiveOpencallContext = createContext(null);
export const ArtInOpencallContext = createContext(null);

function Artist(props) {
    const [opencallContext, setOpencallContext] = useState({});
    const [artInOpencall, setArtInOpencall] = useState({
        allArt: [],
        inOpencall: []
    });

    return (
        <div className='artist'>
        <ActiveOpencallContext.Provider value={{ opencallContext, setOpencallContext }}>
            <ArtInOpencallContext.Provider value={{ artInOpencall, setArtInOpencall }}>
                
                    <ChooseOpencall />
                    <AddArt className="addart"/>
                    <Routes>
                        <Route path="/gallery" element={<ArtistGallery title="Artist Gallery" />} />
                    </Routes>
                
            </ArtInOpencallContext.Provider>
            </ActiveOpencallContext.Provider>
        </div>
    );
}

export default Artist;