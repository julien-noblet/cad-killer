import { SearchControl, GeoApiFrProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import { useEffect } from 'react';

export const Search = () => {

    const map = useMap();
    const searchControl = SearchControl({
        provider: new GeoApiFrProvider({params: {autocomplete: true, lat: map.getCenter().lat, lon: map.getCenter().lng}}),
        style: 'bar',
        showMarker: true,
        showPopup: true,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Search for an address',
        notFoundMessage: 'No results found',
        messageHideDelay: 3000,
       // position: 'topleft',
    });

    useEffect(() => {
        map.addControl(searchControl);
    }, [SearchControl, map]);
    return null;
}