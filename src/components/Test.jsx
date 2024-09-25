import React, { useState } from "react";
import axios from "axios";

const Test = () => {
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleSaveClick = async () => {
        try {
            const API_KEY = "AIzaSyD-_p4x8ysVeIqV1H92viTaonxkBW80QYA"; // Replace with your Google Maps API Key
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
            );
            const location = response.data.results[0].geometry.location;
            setCoordinates(location);
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter address"
            />
            <button onClick={handleSaveClick}>Save</button>

            {coordinates && (
                <div>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lng}</p>
                </div>
            )}
        </div>
    );
};

export default Test;
