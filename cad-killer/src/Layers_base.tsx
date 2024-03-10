
import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';


/*

export const baseMaps = {
    "OpenStreetMap France": layerOSMfr,
    OpenStreetMap: layerOSM,
    // "Carte IGN": layerIGN, // je n'arrive pas a renouveller la clé IGN pour le moment
    Cadastre: layerCadastre,
    Esri: layerEsriWorldImagery,
    "World Street Map" : layerEsriWorldStreetMap,
  };
  */

export const LayerOSM = () => {
    return (
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </LayersControl.BaseLayer>
    )
}

export const LayerOSMfr = () => {
    return (
        <LayersControl.BaseLayer name="OpenStreetMap France">
            <TileLayer
                url="//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                maxZoom={20}
                attribution='Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>'
            />
        </LayersControl.BaseLayer>
    )
}


export const LayerCadastre = () => {
    return (
        <LayersControl.BaseLayer name="Cadastre">
            <TileLayer
                url="http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png"

                maxZoom={22}
                minZoom={16}
                attribution="&copy; Cadastre"
            />
        </LayersControl.BaseLayer>
    )
}



export const LayerEsriWorldImagery = () => {
    return (
        <LayersControl.BaseLayer name="Esri World Imagery">
            <TileLayer
                url="//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
        </LayersControl.BaseLayer>
    )
}

export const LayerEsriWorldStreetMap = () => {
    return (
        <LayersControl.BaseLayer name="World Street Map">
            <TileLayer
                url="//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
        </LayersControl.BaseLayer>
    )
}

