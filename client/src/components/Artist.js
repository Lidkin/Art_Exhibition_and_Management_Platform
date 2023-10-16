import React from 'react';
import { Routes, Route } from "react-router-dom";
import AddArt from './ArtistComponents/AddArt';
import ArtistGallery from './ArtistComponents/ArtistGallery';

function Artist(props) {

    return (
        <div className='artist'>
            <Routes>
                <Route path="/gallery" element={<ArtistGallery title="Artist Gallery" />} />
            </Routes>
            <AddArt />
        </div>
    );
}

export default Artist;