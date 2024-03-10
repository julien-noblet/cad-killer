import React from 'react';
import {  MapContainer, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import Layers from './Layers';
import { Search } from './Search';

const defaultLatLng: LatLngTuple = [48.865572, 2.283523];
const zoom: number = 8;

const LeafletMap: React.FC = () => {
 
  return (
    <MapContainer id="mapId"
      style = {{height: "100vh"}}
      center={defaultLatLng}
      zoom={zoom}>
        <Search />
       <TileLayer
                url="//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                maxZoom={20}
                attribution='Fond de plan &copy; <a href="https://openstreetmap.fr/">OpenStreetMap France</a>'
            />
      <Layers />
      
    </MapContainer>
  )
}

export default LeafletMap;