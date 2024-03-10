
import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const OverlayBAN = () => {
    return (
        <LayersControl.Overlay name="BAN(O)">
            <TileLayer
                url="https://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png"
                maxZoom={20}
                attribution="Surcouche: &copy; BAN(O)"
            />
        </LayersControl.Overlay>
    )
}

export const OverlayCadastre = () => {
    return (
        <LayersControl.Overlay name="Cadastre">
            <TileLayer
                url="http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png"
                maxZoom={22}
                minZoom={16}
                attribution="&copy; Cadastre"
            />
        </LayersControl.Overlay>
    )
}

/*
export const overlayMaps = {
    Cadastre: overlayCadastre,
    "BAN(O)": overlayBAN,
};*/
