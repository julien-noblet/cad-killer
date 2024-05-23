import { SearchControl, GeoApiFrProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { useEffect } from "react";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export const Search = () => {
  const map = useMap();
  const searchControl = SearchControl({
    provider: new GeoApiFrProvider({
      searchUrl: "https://api-adresse.data.gouv.fr/search",
      reverseUrl: "https://api-adresse.data.gouv.fr/reverse",
      params: {
        autocomplete: 1,
        lat: map.getCenter().lat,
        lon: map.getCenter().lng,
        limit: 5,
      },
    }),
    autoCompleteDelay: 500,
    style: "bar",
    marker: {
      // optional: L.Marker    - default L.Icon.Default
      icon: new L.Icon.Default(),
      draggable: false,
    },
    showMarker: true,
    showPopup: true,
    autoClose: true,
    retainZoomLevel: false,
    animateZoom: true,
    keepResult: true,
    searchLabel: "Ex. 6 rue de la gare, Paris",
    notFoundMessage: "Pas de résultat trouvé.",
    messageHideDelay: 3000,
    // position: 'topleft',
  });

  useEffect(() => {
    map.addControl(searchControl);
  }, [map]);
  return null;
};

