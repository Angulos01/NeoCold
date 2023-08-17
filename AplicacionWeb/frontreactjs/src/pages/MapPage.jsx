
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "../UseMap";
import "leaflet/dist/leaflet.css"; // <- Leaflet styles
import Sidebar from "../components/sidebar/Sidebar";

const MapView = () => {
  const { position } = useMap();
  return (
    <div>
    <Sidebar />
        <div className="everything">
            <MapContainer
            center={position}
            zoom={12}
            scrollWheelZoom={true}
            style={{ minHeight: "100vh", minWidth: "100vw" }}
            >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </MapContainer>
        </div>
    </div>
  );
};

export default MapView;