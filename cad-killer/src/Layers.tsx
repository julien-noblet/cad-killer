import React from 'react';
import { LayersControl  } from 'react-leaflet';
import { LayerCadastre, LayerEsriWorldImagery, LayerEsriWorldStreetMap, LayerOSM, LayerOSMfr } from './Layers_base';
import { OverlayBAN, OverlayCadastre } from './Layers_overlays';

const Layers = () => {

    return (
        <LayersControl position="topright">
            {/* Base layers */}
            <LayerOSMfr />
            <LayerOSM />
            <LayerCadastre />
            <LayerEsriWorldImagery />
            <LayerEsriWorldStreetMap />

            {/* Overlays */}
            <OverlayCadastre />
            <OverlayBAN />
           
        </LayersControl>
    );
};

export default Layers;