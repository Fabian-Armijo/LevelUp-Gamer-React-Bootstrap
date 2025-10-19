import React from 'react';
import InteractiveMap from '../../molecules/InteractiveMap/InteractiveMap';
import './EventsMapSection.css';


const EventsMapSection = () => {
  return (
    <section className="events-map-section">
      <div className="section-header">
        <h2 className="section-title">Eventos y Puntos LevelUp</h2>
        <p className="section-subtitle">
          Participa en eventos gamers a lo largo de Chile. ¡Visita estas ubicaciones, compite y gana Puntos LevelUp para canjear por productos!
        </p>
      </div>
      <div className="map-container">
        <InteractiveMap />
      </div>
    </section>
  );
};

export default EventsMapSection;