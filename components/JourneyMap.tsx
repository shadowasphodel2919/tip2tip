"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet markers in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const highwayRoute: [number, number][] = [
  [23.1291, 113.2644], // Guangzhou
  [24.80, 113.59],
  [26.90, 112.60],
  [28.22, 112.94],
  [30.59, 114.30],
  [34.75, 113.62],
  [37.87, 112.55],
  [40.84, 111.75],
  [43.65, 111.98], // Erenhot
];

const tip2tipRoute: [number, number][] = [
  [23.1291, 113.2644], // Guangzhou
  [24.20, 113.40],
  [25.30, 113.10],
  [26.50, 112.80],
  [27.50, 112.90],
  [28.22, 112.94], // Changsha
  [29.20, 113.40],
  [30.10, 113.90],
  [30.59, 114.30], // Wuhan-ish
  [31.80, 113.90],
  [33.10, 113.80],
  [34.75, 113.62], // Zhengzhou
  [36.20, 113.10],
  [37.87, 112.55], // Taiyuan
  [39.20, 112.10],
  [40.84, 111.75], // Hohhot
  [43.65, 111.98], // Erenhot
];

export default function JourneyMap() {
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/10 opacity-30 md:opacity-50 blur-[2px] transition-all duration-1000 hover:blur-none hover:opacity-100" style={{ pointerEvents: 'auto' }}>
      <MapContainer
        center={[32, 112]}
        zoom={4.25}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Planned highway corridor */}
        <Polyline
          positions={highwayRoute}
          pathOptions={{
            color: "#facc15",
            weight: 5,
            opacity: 0.75,
            dashArray: "10 10",
          }}
        >
          <Tooltip sticky>Approximate route corridor</Tooltip>
        </Polyline>

        {/* Actual journey route */}
        <Polyline
          positions={tip2tipRoute}
          pathOptions={{
            color: "#ef4444",
            weight: 6,
            opacity: 0.95,
          }}
        >
          <Tooltip sticky>Tip 2 Tip journey so far</Tooltip>
        </Polyline>

        {/* Start */}
        <Marker position={tip2tipRoute[0]}>
          <Popup>Start: Guangzhou</Popup>
        </Marker>

        {/* Current-ish */}
        <Marker position={[37.87, 112.55]}>
          <Popup>Current stretch (approx)</Popup>
        </Marker>

        {/* Destination */}
        <Marker position={tip2tipRoute[tip2tipRoute.length - 1]}>
          <Popup>Destination: Erenhot</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
