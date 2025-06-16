// OrderTracking.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './css/OrderTracking.css';

// Custom marker icon fix for Leaflet in React
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const OrderTracking = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setError('Permission denied or unavailable.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    if (location) {
      setTrackingInfo({
        status: 'Out for delivery',
        estimatedArrival: '3:30 PM',
        deliveryAgent: 'John Doe',
      });
    }
  }, [location]);

  return (
    <div className="geo-tracking-container">
      <h2><img src="/media/images/running_corgi.gif" alt="Fat Corgi" className="fat_corgi" /> Order Tracking</h2>

      {error && <p className="text-danger">{error}</p>}

      {location && (
        <div className="location-info">
          <p><strong>Your Location:</strong></p>
          <p>Latitude: {location.latitude.toFixed(4)}</p>
          <p>Longitude: {location.longitude.toFixed(4)}</p>

          <div className="map-container mt-3">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.latitude, location.longitude]} icon={markerIcon}>
                <Popup>
                  You are here!
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {trackingInfo && (
        <div className="tracking-details mt-4">
          <p><strong>Status:</strong> {trackingInfo.status}</p>
          <p><strong>ETA:</strong> {trackingInfo.estimatedArrival}</p>
          <p><strong>Delivery Agent:</strong> {trackingInfo.deliveryAgent}</p>
        </div>
      )}

      {!location && !error && <p>Fetching your location...</p>}
    </div>
  );
};

export default OrderTracking; // ✅ REQUIRED
