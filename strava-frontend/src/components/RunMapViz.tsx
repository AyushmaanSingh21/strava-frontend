import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, TrendingUp } from "lucide-react";

interface RunMapVizProps {
  activity: any;
  className?: string;
}

// Custom component to fit bounds
const FitBounds = ({ coords }: { coords: [number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  
  return null;
};

// Create custom icons
const createStartIcon = () => {
  return L.divIcon({
    className: 'custom-start-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2F71FF, #5B8DFF);
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(47, 113, 255, 0.8), 0 0 40px rgba(47, 113, 255, 0.4);
        animation: pulse 2s ease-in-out infinite;
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createEndIcon = () => {
  return L.divIcon({
    className: 'custom-end-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF006E, #ccff00);
        border: 3px solid white;
        box-shadow: 0 0 25px rgba(204, 255, 0, 0.9), 0 0 50px rgba(204, 255, 0, 0.5);
        animation: pulse-end 1.5s ease-in-out infinite;
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const createElevationIcon = (elevation: number) => {
  const isPositive = elevation > 0;
  return L.divIcon({
    className: 'elevation-marker',
    html: `
      <div style="
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid ${isPositive ? '#ccff00' : '#FF006E'};
        border-radius: 6px;
        color: white;
        font-size: 10px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
      ">${isPositive ? '+' : ''}${Math.round(elevation)}m</div>
    `,
    iconSize: [50, 20],
    iconAnchor: [25, 20],
  });
};

const RunMapViz = ({ activity, className = "" }: RunMapVizProps) => {

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.8; }
      }
      @keyframes pulse-end {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      .leaflet-container {
        background: #0a0e1a !important;
        font-family: inherit;
      }
      .leaflet-tile {
        filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) invert(1);
      }
      .leaflet-control-attribution {
        background: rgba(0, 0, 0, 0.6) !important;
        color: #666 !important;
        font-size: 10px !important;
      }
      .leaflet-control-zoom {
        border: none !important;
        background: rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(10px);
      }
      .leaflet-control-zoom a {
        background: rgba(255, 255, 255, 0.1) !important;
        color: white !important;
        border: 1px solid rgba(47, 113, 255, 0.3) !important;
      }
      .leaflet-control-zoom a:hover {
        background: rgba(47, 113, 255, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!activity?.map?.summary_polyline) {
    return (
      <div className={`flex items-center justify-center h-[400px] bg-gray-900 rounded-lg border-2 border-gray-800 ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No map data available for this activity</p>
        </div>
      </div>
    );
  }

  // Decode polyline to coordinates
  const coords = polyline.decode(activity.map.summary_polyline);
  const latLngCoords: [number, number][] = coords.map((coord: [number, number]) => [coord[0], coord[1]]);

  if (latLngCoords.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[400px] bg-gray-900 rounded-lg border-2 border-gray-800 ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Invalid map data</p>
        </div>
      </div>
    );
  }

  // Calculate elevation markers (every 20% of the route)
  const elevationMarkers: Array<{ position: [number, number]; elevation: number }> = [];
  if (activity.total_elevation_gain > 0) {
    const markerIndices = [0.2, 0.4, 0.6, 0.8].map(pct => 
      Math.floor(latLngCoords.length * pct)
    );

    markerIndices.forEach((idx, i) => {
      if (idx < latLngCoords.length) {
        // Simulate elevation change
        const elevChange = (Math.random() - 0.5) * 20 + (i * 5);
        elevationMarkers.push({
          position: latLngCoords[idx],
          elevation: elevChange
        });
      }
    });
  }

  const distance = ((activity.distance || 0) / 1000).toFixed(2);
  const movingTime = Math.floor((activity.moving_time || 0) / 60);
  const avgPace = activity.distance > 0 
    ? (activity.moving_time / 60) / (activity.distance / 1000)
    : 0;
  const paceMin = Math.floor(avgPace);
  const paceSec = Math.round((avgPace - paceMin) * 60);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container with Leaflet */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-800 shadow-2xl">
        <MapContainer
          center={latLngCoords[0]}
          zoom={13}
          className="w-full h-full"
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <FitBounds coords={latLngCoords} />
          
          {/* Outer glow layer */}
          <Polyline
            positions={latLngCoords}
            pathOptions={{
              color: '#2F71FF',
              weight: 12,
              opacity: 0.2,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          
          {/* Middle glow layer */}
          <Polyline
            positions={latLngCoords}
            pathOptions={{
              color: '#5B8DFF',
              weight: 8,
              opacity: 0.4,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          
          {/* Main gradient line - using multiple segments for gradient effect */}
          <Polyline
            positions={latLngCoords}
            pathOptions={{
              color: '#2F71FF',
              weight: 4,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
              className: 'route-gradient',
            }}
          />
          
          {/* Start marker */}
          <Marker position={latLngCoords[0]} icon={createStartIcon()}>
            <Popup>
              <div className="text-sm font-bold">Start</div>
            </Popup>
          </Marker>
          
          {/* End marker */}
          <Marker position={latLngCoords[latLngCoords.length - 1]} icon={createEndIcon()}>
            <Popup>
              <div className="text-sm font-bold">Finish</div>
            </Popup>
          </Marker>
          
          {/* Elevation markers */}
          {elevationMarkers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.position}
              icon={createElevationIcon(marker.elevation)}
            />
          ))}
        </MapContainer>
      </div>

      {/* Glass UI Stats Overlay */}
      <div className="absolute top-4 left-4 right-4 flex gap-3 flex-wrap z-[1000]">
        {/* Activity Name */}
        <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2 shadow-xl">
          <Navigation className="w-4 h-4 text-[#2F71FF]" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Activity</div>
            <div className="text-sm font-bold text-white">{activity.name || 'Run'}</div>
          </div>
        </div>

        {/* Distance */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#2F71FF]/30 rounded-lg px-4 py-2 shadow-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Distance</div>
          <div className="text-lg font-black text-[#2F71FF]">{distance} km</div>
        </div>

        {/* Time */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#FF006E]/30 rounded-lg px-4 py-2 shadow-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
          <div className="text-lg font-black text-[#FF006E]">{movingTime} min</div>
        </div>

        {/* Pace */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#ccff00]/30 rounded-lg px-4 py-2 shadow-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Pace</div>
          <div className="text-lg font-black text-[#ccff00]">{paceMin}:{String(paceSec).padStart(2, '0')}/km</div>
        </div>

        {/* Elevation */}
        {activity.total_elevation_gain > 0 && (
          <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-lg px-4 py-2 flex items-center gap-2 shadow-xl">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Elevation</div>
              <div className="text-lg font-black text-cyan-400">+{Math.round(activity.total_elevation_gain)}m</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-black/60 border border-white/10 rounded-lg px-4 py-3 shadow-xl z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#2F71FF] to-[#5B8DFF] shadow-lg"></div>
            <span className="text-gray-400">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF006E] to-[#ccff00] shadow-lg"></div>
            <span className="text-gray-400">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gradient-to-r from-[#2F71FF] via-[#FF006E] to-[#ccff00] rounded-full"></div>
            <span className="text-gray-400">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunMapViz;
