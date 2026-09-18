import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import type { Property } from '../core/types';
import L from 'leaflet';


interface PropertyMapProps {
  properties: Property[];
  activeId?: string | null;
}

function createPriceMarker(price: number, isActive: boolean) {
  const label = `₦${Math.round(price / 1000)}k`;
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${isActive ? '#ea580c' : '#334155'};
      color:#fff;
      font-size:12px;
      font-weight:700;
      padding:4px 8px;
      border-radius:999px;
      white-space:nowrap;
      text-align:center;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      transform:scale(${isActive ? 1.15 : 1});
    ">${label}</div>`,
    iconSize: [56, 26],
    iconAnchor: [28, 26],
  });
}



export function PropertyMap({properties, activeId}: PropertyMapProps) {
  const located = properties.filter((p) => p.coordinates);

  
  return (
      <MapContainer
        center={[4.8156, 7.0134]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((property) => (
          <Marker
            key={property.id}
            position={[property.coordinates!.lat, property.coordinates!.lng]}
            icon={createPriceMarker(property.price, property.id === activeId)}
            zIndexOffset={property.id === activeId ? 1000 : 0}
          />
        ))}

      </MapContainer>
    );
  }