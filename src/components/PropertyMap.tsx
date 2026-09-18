import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '../core/types';

const PORT_HARCOURT_CENTER: [number, number] = [4.8156, 7.0498];
const DEFAULT_ZOOM = 12;

type Located = Property & { coordinates: NonNullable<Property['coordinates']> };

function hasCoordinates(property: Property): property is Located {
  return property.coordinates !== undefined;
}

// divIcon renders raw HTML, so only numeric values are interpolated here.
// Never interpolate free text (titles, locations) without escaping first.
function createPriceMarker(price: number, isActive: boolean) {
  const label = `₦${Math.round(price / 1000)}k`;
  const background = isActive ? '#ea580c' : '#334155';
  const scale = isActive ? 1.1 : 1;

  return L.divIcon({
    className: '',
    html: `<div style="
      background:${background};
      color:#fff;
      font-size:12px;
      font-weight:700;
      padding:4px 8px;
      border-radius:999px;
      white-space:nowrap;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      transform:scale(${scale});
      transition:transform .15s ease, background .15s ease;
      text-align:center;
    ">${label}</div>`,
    iconSize: [56, 26],
    iconAnchor: [28, 26],
  });
}

function FitToMarkers({ properties }: { properties: Located[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    const points = properties.map(
      (p) => [p.coordinates.lat, p.coordinates.lng] as [number, number]
    );

    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
    }
  }, [properties, map]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
  activeId?: string | null;
  onMarkerClick?: (propertyId: string) => void;
}

export function PropertyMap({ properties, activeId, onMarkerClick }: PropertyMapProps) {
  const located = useMemo(() => properties.filter(hasCoordinates), [properties]);

  return (
    <MapContainer
      center={PORT_HARCOURT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToMarkers properties={located} />

      {located.map((property) => (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng]}
          icon={createPriceMarker(property.price, property.id === activeId)}
          eventHandlers={{ click: () => onMarkerClick?.(property.id) }}
          alt={`${property.title} — ₦${property.price.toLocaleString()}`}
        />
      ))}
    </MapContainer>
  );
}
