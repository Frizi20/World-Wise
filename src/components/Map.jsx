import { useSearchParams, useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import Flag from "./Flag";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}

export default function Map() {
    const [mapPosition, setMapPosition] = useState([47, 17]);
    // const [zoom, setZoom] = useState(10)
    const { cities } = useCities();


    const {
        isLoading: isLoadingPosition,
        position: geoloCationPosition,
        getPosition,
    } = useGeolocation();

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();

    const { lat, lng } = useUrlPosition("lat", "lng");

    useEffect(() => {
        if (lat && lng) setMapPosition([lat, lng]);
    }, [lng, lat]);

    useEffect(() => {
        const { lat, lng } = geoloCationPosition;


        if (!lat || !lng) return;
        setMapPosition([geoloCationPosition.lat, geoloCationPosition.lng]);
        // setSearchParams({lat,lng})
    }, [geoloCationPosition]);

    return (
        <div className={styles.mapContainer}>
            {isEmpty(geoloCationPosition) && (
                <Button onClick={getPosition} type="position">
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={3}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city) => {
                    return (
                        <Marker key={city.id} position={city.position}>
                            <Popup>
                                <span>
                                    {" "}
                                    <Flag country={city.emoji} />{" "}
                                </span>
                                <span> {city.cityName} </span>
                            </Popup>
                        </Marker>
                    );
                })}
                <ChangeCenter position={mapPosition} />
                <DetectCLick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectCLick() {
    const navigate = useNavigate();

    useMapEvents({
        click: function (e) {
            const { lat, lng } = e.latlng;
            navigate(`form?lat=${lat}&lng=${lng}`);
        },
    });
}
