import React from 'react';
import { Routes, Route } from "react-router-dom";
//import SelectArt from './CuratorComponents/SelectArt';
import AddOpencall from './CuratorComponents/AddOpencall';
import Gallery from './CuratorComponents/CuratorGallery';
import Opencall from './CuratorComponents/CuratorOpencall';

function Curator(props) {

    return (
        <div className='curator'>
            <Routes>
                <Route path="/opencall" element={<Opencall title="Opencall" />} />
                <Route path="/gallery" element={<Gallery title="Gallery" />} />
            </Routes>
            <AddOpencall />
        </div>
    );
}

export default Curator;