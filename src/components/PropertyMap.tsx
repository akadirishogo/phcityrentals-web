import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';


export function PropertyMap() {
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
      </MapContainer>
    );
  }