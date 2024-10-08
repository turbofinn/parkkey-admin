import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import './MapModal.css';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 28.7041,
    lng: 77.1025,
};

const FullAddressAutoCompleteMap = ({ setOpenAddressDialog }) => {
    const [coordinates, setCoordinates] = useState(center);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const autocompleteRef = useRef(null);

    const API_KEY = 'AIzaSyD-_p4x8ysVeIqV1H92viTaonxkBW80QYA';
    const libraries = ['places'];

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setCoordinates({ lat, lng });
        setMarker({ lat, lng });
    };

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCoordinates({ lat, lng });
            setMarker({ lat, lng });
            map.setCenter({ lat, lng });

            const addressComponents = place.address_components;
            let formattedAddress = place.formatted_address;
            let city = '';
            let state = '';
            let postalCode = '';

            addressComponents.forEach((component) => {
                const types = component.types;
                if (types.includes('locality')) {
                    city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }
                if (types.includes('postal_code')) {
                    postalCode = component.long_name;
                }
            });

            setAddress(formattedAddress);
            setCity(city);
            setState(state);
            setPostalCode(postalCode);
        }
    };

    const modalStyles = {
        display: 'flex',
        position: 'fixed',
        zIndex: '9999',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const modalContentStyles = {
        backgroundColor: '#fff',
        padding: '1rem',
        border: '1px solid #888',
        width: '60%',
        maxWidth: '40vw',
        textAlign: 'center',
        zIndex: 10000,
    };

    return (
        <div>
            <div style={modalStyles}>
                <div style={modalContentStyles}>
                    <span
                        style={{ float: 'right', cursor: 'pointer', fontSize: '1.5rem' }}
                        onClick={() => setOpenAddressDialog(false)}
                    >
                        &times;
                    </span>
                    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
                        <Autocomplete
                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                            onPlaceChanged={handlePlaceSelect}
                        >
                            <input
                                type="text"
                                placeholder="Enter an address"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    position: 'relative',
                                    zIndex: '99999',
                                }}
                            />
                        </Autocomplete>

                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={coordinates}
                            zoom={10}
                            onClick={handleMapClick}
                            onLoad={(mapInstance) => setMap(mapInstance)}
                        >
                            {marker && <Marker position={marker} />}
                        </GoogleMap>
                    </LoadScript>

                    <div style={{}}>
                        <p>Latitude: {coordinates.lat}</p>
                        <p>Longitude: {coordinates.lng}</p>
                        <p>City: {city}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullAddressAutoCompleteMap;
