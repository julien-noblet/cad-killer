import React, { useState, useEffect } from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import Layers from "./Layers";
import { Search } from "./Search";
import Hash from "./Hash";
//Component

const LeafletMap: React.FC = () => {

  //Default coordinates

  const [formData, setFormData] = useState({
    latitude: 46.498,
    longitude: 2.197,
    zoom: 6,
  });

  const getLatLng = (): LatLngTuple => {
    return [formData.latitude, formData.longitude];
  };

  

  return (
    <MapContainer
      id="map"
      style={{
        height: "calc(100vh - 60px)",
        bottom: 0,
        margin: 0,
        left: 0,
        right: 0,
        top: "50px",
        width: "100%",
      }}
      center={getLatLng()}
      zoom={formData.zoom}
    >
      <Hash  formData={formData} setFormData={setFormData} />
      <Search />
      <Layers />
    </MapContainer>
  );
};

export default LeafletMap;
