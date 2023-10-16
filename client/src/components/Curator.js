import React from 'react';
import { Routes, Route } from "react-router-dom";
import AddArt from './ArtistComponents/AddArt';
import CuratorGallery from './CuratorComponents/OpenCall';

function Curator(props) {

    return (
        <div className='curator'>
            <Routes>
                <Route path="/gallery" element={<CuratorGallery title="Curator Gallery" />} />
            </Routes>
            <AddArt />
        </div>
    );
}

export default Curator;