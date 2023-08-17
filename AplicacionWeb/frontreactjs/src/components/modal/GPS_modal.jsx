import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useMap } from '../../UseMap';
import 'leaflet/dist/leaflet.css'; // <- Leaflet styles

const GpsModal = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastLatitud, setLastLatitud] = useState(0);
  const [lastLongitud, setLastLongitud] = useState(0);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const latitudes = data.map((item) => parseFloat(item.latitud));
    const longitudes = data.map((item) => parseFloat(item.longitud));
    const newMarkers = latitudes.map((lat, index) => ({
      lat,
      lng: longitudes[index],
      isNewest: index === latitudes.length - 1,
    }));

    setLastLatitud(newMarkers[newMarkers.length - 1].lat);
    setLastLongitud(newMarkers[newMarkers.length - 1].lng);

    //Limite de marcadores de GPS
    const limitedMarkers = newMarkers.slice(Math.max(newMarkers.length - 5, 0));
    setMarkers(limitedMarkers);
  }, [data]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <button className='modal-button-map' onClick={handleModalToggle}>
        GPS
      </button>
      {isModalOpen && (
        <div className='modal-overlay-map'>
          <div className='modal-content-map'>
            <button className='modal-close-map' onClick={handleModalToggle}>
              X
            </button>
            <div className='map-container'>
              <MapContainer
                center={[lastLatitud, lastLongitud]}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: '80vh', width: '80vw' }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Polyline
                  positions={markers.map(marker => [marker.lat, marker.lng])}
                  color='blue'
                />
                {markers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={[marker.lat, marker.lng]}
                    opacity={marker.isNewest ? 1 : 0.4} // Set opacity based on whether it's the newest marker
                  >
                    <Popup>
                      Latitude: {marker.lat} <br />
                      Longitude: {marker.lng}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GpsModal;
