import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Lista de ubicaciones con sus coordenadas
// Puedes obtener coordenadas fácilmente buscando un lugar en Google Maps
// y haciendo clic derecho -> "Copiar coordenadas"
const eventLocations = [
  { position: [-33.4589, -70.6053], name: 'Movistar Gameclub Mallplaza Vespucio', desc: 'Torneos semanales y eventos especiales.' },
  { position: [-36.8271, -73.0651], name: 'Movistar Gameclub Mallplaza Trébol', desc: 'El punto de encuentro gamer en Concepción.' },
  { position: [-33.3644, -70.6558], name: 'Movistar Gameclub Mallplaza Norte', desc: 'Compite y gana en la zona norte de Santiago.' },
  { position: [-33.4357, -70.6416], name: 'Estación Mapocho', desc: 'Sede de grandes eventos como Festigame.' },
  { position: [-33.4542, -70.6806], name: 'Movistar Arena', desc: 'Finales de e-sports y eventos masivos.' },
  { position: [-33.5134, -70.7303], name: 'Arena XP Mall Plaza Oeste', desc: 'Experiencias y torneos de e-sports.' },
  { position: [-38.7408, -72.6133], name: 'Arena XP Portal Temuco', desc: 'El hub de los videojuegos en el sur.' },
];

const InteractiveMap = () => {
  // Coordenadas para centrar el mapa inicialmente (Santiago)
  const mapCenter = [-33.45, -70.6667];

  return (
    <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
      {/* La capa de "azulejos" que forma el mapa visual */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Mapeamos sobre nuestras ubicaciones para crear un marcador para cada una */}
      {eventLocations.map((location, index) => (
        <Marker key={index} position={location.position}>
          <Popup>
            <strong>{location.name}</strong><br />
            {location.desc}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;