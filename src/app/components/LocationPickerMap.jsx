"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon Leaflet di Next.js (supaya marker kelihatan)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  onSelectLocation,
  defaultCenter = [-6.911435926513646, 107.57701686406499],
}) {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handleMapClick = (lat, lng) => {
    setMarkerPosition([lat, lng]);
    onSelectLocation(lat, lng);
  };

  const center = markerPosition || defaultCenter;

  return (
    <div className="w-full h-[400px]">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onClick={handleMapClick} />

        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  );
}
