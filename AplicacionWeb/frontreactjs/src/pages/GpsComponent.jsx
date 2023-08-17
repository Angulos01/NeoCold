import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <- Leaflet styles

const GpsComponent = ({ data }) => {
  const [lastLatitud, setLastLatitud] = useState(0);
  const [lastLongitud, setLastLongitud] = useState(0);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const allMarkers = [];

    for (const [boxName, deviceData] of Object.entries(data)) {
      const latitudes = deviceData.map((item) => parseFloat(item.latitud));
      const longitudes = deviceData.map((item) => parseFloat(item.longitud));

      const newMarkers = latitudes.map((lat, index) => ({
        box: boxName,
        lat,
        lng: longitudes[index],
        isNewest: index === latitudes.length - 1,
      }));

      allMarkers.push(...newMarkers);
    }

    setLastLatitud(allMarkers[allMarkers.length - 1].lat);
    setLastLongitud(allMarkers[allMarkers.length - 1].lng);

    // Limita el número de marcadores a mostrar
    const limitedMarkers = allMarkers.slice(Math.max(allMarkers.length - 5, 0));
    setMarkers(limitedMarkers);
  }, [data]);

  return (
    <div className='map-component'>
      <div className='map-container'>
        <MapContainer
          center={[31.226417793946418, -108.72055132494883]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: '80vh', width: '80vw' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
            >
              <Popup>
                Caja: {marker.box} <br />
                Latitud: {marker.lat} <br />
                Longitud: {marker.lng}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GpsComponent;
