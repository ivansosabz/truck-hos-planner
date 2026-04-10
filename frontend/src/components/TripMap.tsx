import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { TripPlanResponse } from "../types/trip";

interface TripMapProps {
    tripResult: TripPlanResponse;
}

const TripMap = ({ tripResult }: TripMapProps) => {
    const current = tripResult.locations.current;
    const pickup = tripResult.locations.pickup;
    const dropoff = tripResult.locations.dropoff;

    const toPickupCoords = tripResult.route_geometry.to_pickup.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
    );

    const toDropoffCoords = tripResult.route_geometry.to_dropoff.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
    );

    const center: [number, number] = [current.latitude, current.longitude];

    return (
        <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%", marginTop: "24px", borderRadius: "10px" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[current.latitude, current.longitude]}>
                <Popup>Current: {current.label}</Popup>
            </Marker>

            <Marker position={[pickup.latitude, pickup.longitude]}>
                <Popup>Pickup: {pickup.label}</Popup>
            </Marker>

            <Marker position={[dropoff.latitude, dropoff.longitude]}>
                <Popup>Dropoff: {dropoff.label}</Popup>
            </Marker>

            <Polyline positions={toPickupCoords} />
            <Polyline positions={toDropoffCoords} />
        </MapContainer>
    );
};

export default TripMap;