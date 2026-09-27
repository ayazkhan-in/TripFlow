import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DigitalTwinEntity } from '../../types/travel';

interface DigitalTwinMapViewProps {
  entities: DigitalTwinEntity[];
  selectedCircuit: string;
  weatherParam: {
    rainfallMmPerHour: number;
    windSpeedKmh: number;
    temperatureCelsius: number;
    floodRiskIndex: number;
  };
  onSelectEntity?: (entity: DigitalTwinEntity) => void;
  selectedEntityId?: string | null;
}

const CIRCUIT_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'coh-kerala-heritage': { lat: 10.05, lng: 76.75, zoom: 9 },
  'coh-autumn-kyoto': { lat: 35.35, lng: 137.8, zoom: 8 },
  'coh-rajasthan-royals': { lat: 26.6, lng: 74.8, zoom: 8 },
  kerala: { lat: 10.05, lng: 76.75, zoom: 9 },
  japan: { lat: 35.35, lng: 137.8, zoom: 8 },
  rajasthan: { lat: 26.6, lng: 74.8, zoom: 8 },
  goa: { lat: 15.35, lng: 73.95, zoom: 10 },
};

export const DigitalTwinMapView: React.FC<DigitalTwinMapViewProps> = ({
  entities,
  selectedCircuit,
  weatherParam,
  onSelectEntity,
  selectedEntityId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const vectorsLayerRef = useRef<L.LayerGroup | null>(null);
  const weatherLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapTheme, setMapTheme] = useState<'standard' | 'humanitarian'>('standard');
  const [showPropagationArcs, setShowPropagationArcs] = useState<boolean>(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState<boolean>(true);
  const [entityFilter, setEntityFilter] = useState<'all' | 'vehicle' | 'hotel' | 'attraction' | 'airport'>('all');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerConfig = CIRCUIT_CENTERS[selectedCircuit] || CIRCUIT_CENTERS.kerala;

    const map = L.map(mapContainerRef.current, {
      center: [centerConfig.lat, centerConfig.lng],
      zoom: centerConfig.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap tile layers
    const tileUrl =
      mapTheme === 'humanitarian'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const vectorsGroup = L.layerGroup().addTo(map);
    const weatherGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    vectorsLayerRef.current = vectorsGroup;
    weatherLayerRef.current = weatherGroup;
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapTheme, selectedCircuit]);

  // Update Center when circuit changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const centerConfig = CIRCUIT_CENTERS[selectedCircuit] || CIRCUIT_CENTERS.kerala;
    mapInstanceRef.current.flyTo([centerConfig.lat, centerConfig.lng], centerConfig.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedCircuit]);

  // Render Weather Layer (Precipitation Radar circles & isobars)
  useEffect(() => {
    if (!mapInstanceRef.current || !weatherLayerRef.current) return;
    weatherLayerRef.current.clearLayers();

    if (!showWeatherOverlay) return;

    const centerConfig = CIRCUIT_CENTERS[selectedCircuit] || CIRCUIT_CENTERS.kerala;
    const intensity = weatherParam.rainfallMmPerHour;
    const wind = weatherParam.windSpeedKmh;

    if (intensity > 10 || wind > 30) {
      const stormRadius = Math.max(15000, intensity * 850);

      // Core storm cell
      L.circle([centerConfig.lat + 0.05, centerConfig.lng + 0.1], {
        radius: stormRadius,
        color: intensity > 50 ? '#ef4444' : '#f59e0b',
        weight: 1.5,
        opacity: 0.8,
        fillColor: intensity > 50 ? '#ef4444' : '#3b82f6',
        fillOpacity: Math.min(0.25, 0.08 + intensity * 0.002),
        dashArray: '4, 8',
      }).addTo(weatherLayerRef.current);

      // Outer convective ring
      L.circle([centerConfig.lat + 0.05, centerConfig.lng + 0.1], {
        radius: stormRadius * 1.7,
        color: '#3b82f6',
        weight: 1,
        opacity: 0.5,
        fillColor: '#0284c7',
        fillOpacity: 0.08,
        dashArray: '6, 12',
      }).addTo(weatherLayerRef.current);
    }
  }, [weatherParam, showWeatherOverlay, selectedCircuit]);

  // Render Entity Markers & Cascading Propagation Arcs
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !vectorsLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    vectorsLayerRef.current.clearLayers();

    const filteredEntities = entities.filter(e => {
      if (entityFilter === 'all') return true;
      if (entityFilter === 'vehicle') return e.type === 'vehicle';
      if (entityFilter === 'hotel') return e.type === 'hotel';
      if (entityFilter === 'attraction') return e.type === 'attraction' || e.type === 'cruise';
      if (entityFilter === 'airport') return e.type === 'airport';
      return true;
    });

    // 1. Draw Impact Propagation Vectors (Lines between affected entities)
    if (showPropagationArcs && filteredEntities.length > 1) {
      const vehicle = entities.find(e => e.type === 'vehicle');
      const hotel = entities.find(e => e.type === 'hotel');
      const attraction = entities.find(e => e.type === 'attraction');
      const airport = entities.find(e => e.type === 'airport');

      const drawArc = (
        from: [number, number],
        to: [number, number],
        color: string,
        label: string,
        isDisrupted: boolean
      ) => {
        const polyline = L.polyline([from, to], {
          color,
          weight: isDisrupted ? 2.5 : 1.5,
          dashArray: isDisrupted ? '6, 6' : '3, 6',
          opacity: isDisrupted ? 0.9 : 0.45,
        }).addTo(vectorsLayerRef.current!);

        polyline.bindTooltip(label, {
          permanent: false,
          direction: 'center',
          className: 'px-2 py-0.5 rounded text-[10px] bg-slate-900 text-white font-mono shadow-sm',
        });
      };

      if (airport && vehicle) {
        const isDisrupted = (vehicle.simulatedState.delayMinutes || 0) > 30;
        drawArc(
          airport.coordinates,
          vehicle.coordinates,
          isDisrupted ? '#ef4444' : '#10b981',
          `Airport Transfer • ${vehicle.simulatedState.delayMinutes || 0}m Delay Cascade`,
          isDisrupted
        );
      }

      if (vehicle && hotel) {
        const isDisrupted = (hotel.simulatedState.lobbyBacklogPct || 0) > 40;
        drawArc(
          vehicle.coordinates,
          hotel.coordinates,
          isDisrupted ? '#f59e0b' : '#3b82f6',
          `Check-In Vector • Lobby Surge +${hotel.simulatedState.lobbyBacklogPct || 0}%`,
          isDisrupted
        );
      }

      if (hotel && attraction) {
        const isDisrupted = attraction.simulatedState.status === 'suspended';
        drawArc(
          hotel.coordinates,
          attraction.coordinates,
          isDisrupted ? '#8b5cf6' : '#94a3b8',
          `Excursion Corridor • ${isDisrupted ? 'Activity Suspended' : 'On Track'}`,
          isDisrupted
        );
      }
    }

    // 2. Draw Custom Styled DivIcon Markers
    filteredEntities.forEach(entity => {
      const isSelected = selectedEntityId === entity.id;
      const status = entity.simulatedState.status;

      const statusColor =
        status === 'optimal'
          ? '#10b981'
          : status === 'moderate_risk'
          ? '#f59e0b'
          : status === 'diverted'
          ? '#2563eb'
          : status === 'suspended'
          ? '#8b5cf6'
          : '#ef4444';

      const iconName =
        entity.type === 'vehicle'
          ? 'directions_car'
          : entity.type === 'hotel'
          ? 'hotel'
          : entity.type === 'airport'
          ? 'flight'
          : entity.type === 'cruise'
          ? 'sailing'
          : 'explore';

      const statusBadge =
        entity.type === 'vehicle'
          ? `+${entity.simulatedState.delayMinutes || 0}m`
          : entity.type === 'hotel'
          ? `Lobby ${entity.simulatedState.lobbyBacklogPct || 15}%`
          : entity.type === 'attraction'
          ? entity.simulatedState.status === 'suspended'
            ? 'Suspended'
            : 'Caution'
          : `${entity.simulatedState.avgDelayMins || 5}m Delay`;

      const customIcon = L.divIcon({
        className: 'custom-digital-twin-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <!-- Badge -->
            <div style="
              position: absolute;
              top: -18px;
              white-space: nowrap;
              padding: 1px 6px;
              border-radius: 9999px;
              background-color: ${status === 'optimal' ? '#0f172a' : statusColor};
              color: #ffffff;
              font-size: 9px;
              font-weight: 700;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">
              ${statusBadge}
            </div>

            <!-- Pulsing Halo for Disrupted Nodes -->
            ${
              status !== 'optimal'
                ? `<div style="
                    position: absolute;
                    width: 36px;
                    height: 36px;
                    border-radius: 9999px;
                    background-color: ${statusColor};
                    opacity: 0.25;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ''
            }

            <!-- Icon Node Disc -->
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: ${isSelected ? '#2563eb' : '#ffffff'};
              border: 2px solid ${statusColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              transition: transform 0.15s ease;
            ">
              <span class="material-symbols-outlined" style="font-size: 16px; color: ${
                isSelected ? '#ffffff' : statusColor
              };">
                ${iconName}
              </span>
            </div>
          </div>
        `,
      });

      const marker = L.marker(entity.coordinates, { icon: customIcon });

      marker.on('click', () => {
        if (onSelectEntity) {
          onSelectEntity(entity);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [entities, entityFilter, showPropagationArcs, selectedEntityId, onSelectEntity]);

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-2xs">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating HUD Top Left: Telemetry & Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 max-w-xs pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-sm text-slate-800">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Geospatial Simulation</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Live Map</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setShowPropagationArcs(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                showPropagationArcs
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Cascade Arcs</span>
              <span className="text-[9px] font-mono">{showPropagationArcs ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWeatherOverlay(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                showWeatherOverlay
                  ? 'bg-amber-50 border-amber-200 text-amber-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Doppler Radar</span>
              <span className="text-[9px] font-mono">{showWeatherOverlay ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Environmental Readout */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-blue-600">rainy</span>
              <span>{weatherParam.rainfallMmPerHour} mm/h</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-teal-600">air</span>
              <span>{weatherParam.windSpeedKmh} km/h</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-amber-600">thermostat</span>
              <span>{weatherParam.temperatureCelsius}°C</span>
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'vehicle', label: 'Vehicles' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'attraction', label: 'Tours' },
            { id: 'airport', label: 'Hubs' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setEntityFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                entityFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating HUD Top Right: OSM Style Switcher */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-xs pointer-events-auto">
        <button
          type="button"
          onClick={() => setMapTheme('standard')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
            mapTheme === 'standard' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          OpenStreetMap
        </button>
        <button
          type="button"
          onClick={() => setMapTheme('humanitarian')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
            mapTheme === 'humanitarian' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          OSM Humanitarian
        </button>
      </div>

      {/* Bottom Status Ticker */}
      <div className="absolute bottom-3 left-3 right-16 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[16px]">device_hub</span>
            <span className="font-semibold text-slate-800">
              {entities.length} Operational Nodes Active
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Click any node on the map to inspect localized impact
          </span>
        </div>
      </div>
    </div>
  );
};
