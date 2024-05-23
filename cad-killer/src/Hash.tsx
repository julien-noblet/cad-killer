import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import exp from "constants";

type Props = {
    formData: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    setFormData: (formData: {
        latitude: number;
        longitude: number;
        zoom: number;
    }) => void;
};

const Hash: React.FC<Props> = (props) => {
    const navigate = useNavigate();

    const map = useMapEvents({
        moveend: () => {
          const center = map.getCenter();
          const zoom = map.getZoom();
          props.setFormData({
            latitude: center.lat,
            longitude: center.lng,
            zoom: zoom,
          });
        },
      });
    
      useEffect(() => {
        navigate(`/${props.formData.latitude}/${props.formData.longitude}/${props.formData.zoom}`);
      }, [props.formData]);


    return null;
}
export default Hash;