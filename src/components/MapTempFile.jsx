import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ["places"];
const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
};
const center = {
    lat: 21.23658078179948,
    lng: 81.65964136472206,
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

function Test() {
    const [selected, setSelected] = useState(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyD-_p4x8ysVeIqV1H92viTaonxkBW80QYA",
        libraries,
    });

    const onMapClick = useCallback((event) => {
        setSelected({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
    }, []);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                options={options}
                onClick={onMapClick}
            >
                {selected && (
                    <Marker position={{ lat: selected.lat, lng: selected.lng }} />
                )}
            </GoogleMap>
            {selected && (
                <div>
                    <h3>Selected Location</h3>
                    <p>Latitude: {selected.lat}</p>
                    <p>Longitude: {selected.lng}</p>
                </div>
            )}
        </div>
    );
}

export default Test;
