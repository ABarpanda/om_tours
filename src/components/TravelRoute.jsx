import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api"; // Marker,
import { useState } from "react";

const TravelRoute = ( { source, destination }) => {
    const [directions, setDirections] = useState(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    
    const fetchRoute = () => {
        if (!window.google) return; 
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: source,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions:", status);
                }
            }
        );
    };

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap 
                center={{ lat: 20.5937, lng: 78.9629 }}
                zoom={5} 
                mapContainerStyle={{ width: "100%", height: "500px" }}
            >
                {/* <Marker position={source} label="A" />
                <Marker position={destination} label="B" /> */}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
            <button onClick={fetchRoute}>Show Route</button>
        </LoadScript>
    );
};

export default TravelRoute;
