import React, { useState, useEffect, useCallback } from 'react';
import {
  WeatherObservation,
  SocialSignal,
  DigitalTwinEntity,
  DigitalTwinSimulationResult,
} from '../../types/travel';
import { TripFlowApi } from '../../services/api';
import { DigitalTwinMapView } from './DigitalTwinMapView';
import { DigitalTwinCascadePanel, PRESET_SCENARIOS } from './DigitalTwinCascadePanel';
import { DigitalTwinSocialSignals } from './DigitalTwinSocialSignals';

interface DigitalTwinScreenProps {
  showToast: (msg: string) => void;
  onNavigateTab?: (tab: any) => void;
}

// Bookit's Real Active Tour Cohorts
const ACTIVE_COHORTS = [
  {
    id: 'coh-kerala-heritage',
    name: 'Kerala Spice & Backwaters',
    circuit: 'Cochin → Munnar → Thekkady',
    pax: '10 Guests',
    primaryGuest: 'Julian & Claire Sterling',
    bookingRef: 'BK-IN-4902',
    leadGuide: 'Arun V.',
    flag: '🌴',
  },
  {
    id: 'coh-autumn-kyoto',
    name: 'Kyoto Autumn Connoisseurs',
    circuit: 'Tokyo → Hakone → Kyoto',
    pax: '14 Guests',
    primaryGuest: 'Sarah & David Mehta',
    bookingRef: 'BK-JP-8421',
    leadGuide: 'Kenzo Morimoto',
    flag: '🗾',
  },
  {
    id: 'coh-rajasthan-royals',
    name: 'Imperial Rajasthan Retinue',
    circuit: 'Delhi → Jaipur → Udaipur',
    pax: '6 Guests',
    primaryGuest: 'Arjun Singhania',
    bookingRef: 'BK-IN-5104',
    leadGuide: 'Mahaveer Singh',
    flag: '🏰',
  },
];

export const DigitalTwinScreen: React.FC<DigitalTwinScreenProps> = ({ showToast, onNavigateTab }) => {
  const [selectedCohortId, setSelectedCohortId] = useState<string>('coh-kerala-heritage');

  const currentCohort =
    ACTIVE_COHORTS.find(c => c.id === selectedCohortId) || ACTIVE_COHORTS[0];

  // Live Weather State
  const [weatherData, setWeatherData] = useState<WeatherObservation | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);

  // Social Signals State
  const [socialSignals, setSocialSignals] = useState<SocialSignal[]>([]);
  const [dominantSentiment, setDominantSentiment] = useState<string>('concerned');
  const [sentimentBreakdown, setSentimentBreakdown] = useState<any>({
    positive: 1,
    neutral: 1,
    concerned: 3,
    alarmed: 1,
  });
  const [isLoadingSocial, setIsLoadingSocial] = useState<boolean>(true);

  // Simulation Parameters State
  const [selectedPreset, setSelectedPreset] = useState<string>('monsoon_burst');
  const [rainfall, setRainfall] = useState<number>(75);
  const [windSpeed, setWindSpeed] = useState<number>(48);
  const [temperature, setTemperature] = useState<number>(22);
  const [stormDuration, setStormDuration] = useState<number>(6);
  const [floodRisk, setFloodRisk] = useState<number>(75);

  // Simulation Results & Entities State
  const [simulationResult, setSimulationResult] = useState<DigitalTwinSimulationResult | null>(null);
  const [entities, setEntities] = useState<DigitalTwinEntity[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [appliedMitigations, setAppliedMitigations] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<DigitalTwinEntity | null>(null);

  // 1. Fetch Live Weather Data from Open-Meteo for the active cohort
  const fetchLiveWeather = useCallback(async (cohortId: string) => {
    setIsLoadingWeather(true);
    try {
      const data = await TripFlowApi.getDigitalTwinWeather(cohortId);
      if (data) {
        setWeatherData(data);
      }
    } catch (err) {
      console.warn('Weather fetch failed:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // 2. Fetch Real-World Social Signals for the active cohort
  const fetchSocialSignals = useCallback(async (cohortId: string) => {
    setIsLoadingSocial(true);
    try {
      const data = await TripFlowApi.getDigitalTwinSocialSignals(cohortId);
      if (data && data.signals) {
        setSocialSignals(data.signals);
        setDominantSentiment(data.dominantSentiment || 'concerned');
        setSentimentBreakdown(data.sentimentBreakdown || {});
      }
    } catch (err) {
      console.warn('Social signals fetch failed:', err);
    } finally {
      setIsLoadingSocial(false);
    }
  }, []);

  // 3. Run Simulation Engine for the active cohort
  const executeSimulation = useCallback(
    async (params: {
      cohortId: string;
      rainfallMmPerHour: number;
      windSpeedKmh: number;
      temperatureCelsius: number;
      stormDurationHours: number;
      floodRiskIndex: number;
      preset: string;
    }) => {
      setIsSimulating(true);
      try {
        const result = await TripFlowApi.runDigitalTwinSimulation({
          circuit: params.cohortId,
          scenarioPreset: params.preset,
          rainfallMmPerHour: params.rainfallMmPerHour,
          windSpeedKmh: params.windSpeedKmh,
          temperatureCelsius: params.temperatureCelsius,
          stormDurationHours: params.stormDurationHours,
          floodRiskIndex: params.floodRiskIndex,
        });

        if (result && result.entities) {
          setSimulationResult(result);
          setEntities(result.entities);
          if (selectedEntity) {
            const updated = result.entities.find((e: DigitalTwinEntity) => e.id === selectedEntity.id);
            if (updated) setSelectedEntity(updated);
          }
        }
      } catch (err) {
        console.warn('Simulation execution failed:', err);
      } finally {
        setIsSimulating(false);
      }
    },
    [selectedEntity]
  );

  // Initial Load & On Cohort Switch
  useEffect(() => {
    fetchLiveWeather(selectedCohortId);
    fetchSocialSignals(selectedCohortId);

    const defaultPreset = PRESET_SCENARIOS.find(p => p.id === 'monsoon_burst') || PRESET_SCENARIOS[0];
    setRainfall(defaultPreset.params.rainfall);
    setWindSpeed(defaultPreset.params.wind);
    setTemperature(defaultPreset.params.temp);
    setStormDuration(defaultPreset.params.duration);
    setFloodRisk(defaultPreset.params.flood);
    setSelectedPreset('monsoon_burst');

    executeSimulation({
      cohortId: selectedCohortId,
      rainfallMmPerHour: defaultPreset.params.rainfall,
      windSpeedKmh: defaultPreset.params.wind,
      temperatureCelsius: defaultPreset.params.temp,
      stormDurationHours: defaultPreset.params.duration,
      floodRiskIndex: defaultPreset.params.flood,
      preset: 'monsoon_burst',
    });
  }, [selectedCohortId, fetchLiveWeather, fetchSocialSignals]);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_SCENARIOS.find(p => p.id === presetId);
    if (!found) return;

    setSelectedPreset(presetId);
    setRainfall(found.params.rainfall);
    setWindSpeed(found.params.wind);
    setTemperature(found.params.temp);
    setStormDuration(found.params.duration);
    setFloodRisk(found.params.flood);

    executeSimulation({
      cohortId: selectedCohortId,
      rainfallMmPerHour: found.params.rainfall,
      windSpeedKmh: found.params.wind,
      temperatureCelsius: found.params.temp,
      stormDurationHours: found.params.duration,
      floodRiskIndex: found.params.flood,
      preset: presetId,
    });

    showToast(`Simulation preset: ${found.label}`);
  };

  // Re-run simulation with debouncing when sliders change
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSimulation({
        cohortId: selectedCohortId,
        rainfallMmPerHour: rainfall,
        windSpeedKmh: windSpeed,
        temperatureCelsius: temperature,
        stormDurationHours: stormDuration,
        floodRiskIndex: floodRisk,
        preset: selectedPreset,
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [rainfall, windSpeed, temperature, stormDuration, floodRisk, selectedCohortId]);

  // Apply Mitigation to Live System
  const handleApplyMitigation = async (mitigationId: string, action: string) => {
    setAppliedMitigations(prev => [...prev, mitigationId]);
    try {
      await TripFlowApi.applyDigitalTwinMitigation(mitigationId, action, selectedCohortId);
      showToast(`Contingency committed for ${currentCohort.primaryGuest} (#${currentCohort.bookingRef}).`);
    } catch (err) {
      showToast(`Mitigation committed locally.`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Weather-Driven Digital Twin
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Active Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate weather shifts, direct physics & cascading ripples across active Bookit cohorts and bookings.
          </p>
        </div>

        {/* Minimal Tour Cohort Selector */}
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-100 w-fit overflow-x-auto">
          {ACTIVE_COHORTS.map(c => {
            const isSelected = selectedCohortId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCohortId(c.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cohort Context & Live Weather Telemetry Strip */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-600 text-xl">
              {weatherData?.icon || 'partly_cloudy_day'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900">
                {currentCohort.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {currentCohort.pax} (Lead: {currentCohort.leadGuide})
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">
                Booking #{currentCohort.bookingRef} ({currentCohort.primaryGuest})
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open-Meteo Live</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="text-slate-900 font-semibold">{weatherData?.temperatureCelsius ?? 26.2}°C</span>
              <span>·</span>
              <span>{weatherData?.condition || 'Partly Cloudy'}</span>
              <span>·</span>
              <span>Precip: {weatherData?.precipitationMm ?? 0} mm</span>
              <span>·</span>
              <span>Wind: {weatherData?.windSpeedKmh ?? 12} km/h</span>
              <span>·</span>
              <span>Humidity: {weatherData?.humidityPercent ?? 80}%</span>
            </div>
          </div>
        </div>

        {/* 3-Day Forecast Cards */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-end">
          {(weatherData?.forecast || []).slice(0, 3).map((f, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 text-center min-w-[75px]"
            >
              <div className="text-[10px] text-slate-400 font-medium">
                {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 'Day +2'}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{f.maxTemp}°C</div>
              <div className="text-[10px] text-slate-500 truncate max-w-[70px]">{f.condition}</div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fetchLiveWeather(selectedCohortId)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Refresh Live Weather"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${isLoadingWeather ? 'animate-spin' : ''}`}
            >
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Main Row: OpenStreetMap (7 cols) + Social Signals (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <DigitalTwinMapView
            entities={entities}
            selectedCircuit={selectedCohortId}
            weatherParam={{
              rainfallMmPerHour: rainfall,
              windSpeedKmh: windSpeed,
              temperatureCelsius: temperature,
              floodRiskIndex: floodRisk,
            }}
            onSelectEntity={entity => setSelectedEntity(entity)}
            selectedEntityId={selectedEntity?.id}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <DigitalTwinSocialSignals
            signals={socialSignals}
            dominantSentiment={dominantSentiment}
            sentimentBreakdown={sentimentBreakdown}
            isLoading={isLoadingSocial}
            onSelectSignalLocation={coords => {
              showToast(`Corridor report at [${coords[0].toFixed(2)}, ${coords[1].toFixed(2)}]`);
            }}
          />
        </div>
      </div>

      {/* Entity Inspector Card (when node is clicked) */}
      {selectedEntity && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm relative animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setSelectedEntity(null)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors text-xs"
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600 text-2xl">
                {selectedEntity.type === 'vehicle'
                  ? 'directions_car'
                  : selectedEntity.type === 'hotel'
                  ? 'hotel'
                  : selectedEntity.type === 'airport'
                  ? 'flight'
                  : 'explore'}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEntity.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedEntity.id} • {currentCohort.name} • [{selectedEntity.coordinates.join(', ')}]
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                selectedEntity.simulatedState.status === 'optimal'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : selectedEntity.simulatedState.status === 'moderate_risk'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              Simulated Status: {selectedEntity.simulatedState.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Baseline State</div>
              <div className="text-xs font-bold text-slate-900">
                {selectedEntity.normalState.status}
              </div>
              <div className="text-[11px] text-slate-500">
                {selectedEntity.normalState.delayMinutes !== undefined ? `Delay: ${selectedEntity.normalState.delayMinutes}m` : ''}
                {(selectedEntity.normalState as any).lobbyBacklogPct !== undefined ? `Lobby Load: ${(selectedEntity.normalState as any).lobbyBacklogPct}%` : ''}
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] font-semibold text-blue-700 uppercase">Simulated Impact</div>
              <div className="text-xs font-bold text-blue-950">
                {selectedEntity.simulatedState.cascadingCause}
              </div>
              <div className="text-[11px] text-blue-700 font-mono">
                Confidence Score: {Math.round(selectedEntity.simulatedState.confidenceScore * 100)}%
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] font-semibold text-amber-700 uppercase">Higher-Order Ripple</div>
              <div className="text-xs font-bold text-amber-950">
                {selectedEntity.simulatedState.higherOrderImpact}
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast(`Signal sent for ${selectedEntity.name}`);
                  setSelectedEntity(null);
                }}
                className="mt-1 px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer text-[11px]"
              >
                Send Re-route Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Controls & Cascading Panel */}
      <DigitalTwinCascadePanel
        simulationResult={simulationResult}
        rainfall={rainfall}
        setRainfall={setRainfall}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        temperature={temperature}
        setTemperature={setTemperature}
        stormDuration={stormDuration}
        setStormDuration={setStormDuration}
        floodRisk={floodRisk}
        setFloodRisk={setFloodRisk}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        onApplyMitigation={handleApplyMitigation}
        isSimulating={isSimulating}
        appliedMitigations={appliedMitigations}
        cohortName={currentCohort.name}
        primaryGuest={currentCohort.primaryGuest}
        activeBookingRef={currentCohort.bookingRef}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
