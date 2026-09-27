import React from 'react';
import {
  CascadingEffectNode,
  DigitalTwinSimulationResult,
} from '../../types/travel';

interface DigitalTwinCascadePanelProps {
  simulationResult: DigitalTwinSimulationResult | null;
  rainfall: number;
  setRainfall: (v: number) => void;
  windSpeed: number;
  setWindSpeed: (v: number) => void;
  temperature: number;
  setTemperature: (v: number) => void;
  stormDuration: number;
  setStormDuration: (v: number) => void;
  floodRisk: number;
  setFloodRisk: (v: number) => void;
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  onApplyMitigation: (mitigationId: string, action: string) => void;
  isSimulating: boolean;
  appliedMitigations: string[];
  cohortName?: string;
  primaryGuest?: string;
  activeBookingRef?: string;
  onNavigateTab?: (tab: any) => void;
}

export const PRESET_SCENARIOS = [
  {
    id: 'baseline',
    label: 'Normal Baseline',
    desc: 'Clear skies, 25°C, 0mm rain. Normal operations.',
    icon: 'wb_sunny',
    color: 'emerald',
    params: { rainfall: 0, wind: 12, temp: 26, duration: 2, flood: 10 },
  },
  {
    id: 'monsoon_burst',
    label: 'Monsoon Cloudburst',
    desc: '75mm/h torrential rain, 48 km/h wind. Ghat road slippage.',
    icon: 'thunderstorm',
    color: 'rose',
    params: { rainfall: 75, wind: 48, temp: 22, duration: 6, flood: 75 },
  },
  {
    id: 'cyclone',
    label: 'Coastal Cyclone Alert',
    desc: '110 km/h gale force gusts, 95mm rain. Lake & flight grounding.',
    icon: 'cyclone',
    color: 'purple',
    params: { rainfall: 95, wind: 110, temp: 23, duration: 12, flood: 85 },
  },
  {
    id: 'heatwave',
    label: 'Extreme Heatwave',
    desc: '43.5°C peak dry heat. Outdoor excursions unsafe.',
    icon: 'thermostat',
    color: 'amber',
    params: { rainfall: 0, wind: 18, temp: 43.5, duration: 8, flood: 5 },
  },
  {
    id: 'flash_flood',
    label: 'Mountain Landslide Risk',
    desc: '60mm rain + 90% flood risk. NH-85 pass blocked.',
    icon: 'landslide',
    color: 'red',
    params: { rainfall: 60, wind: 35, temp: 20, duration: 10, flood: 90 },
  },
];

export const DigitalTwinCascadePanel: React.FC<DigitalTwinCascadePanelProps> = ({
  simulationResult,
  rainfall,
  setRainfall,
  windSpeed,
  setWindSpeed,
  temperature,
  setTemperature,
  stormDuration,
  setStormDuration,
  floodRisk,
  setFloodRisk,
  selectedPreset,
  onSelectPreset,
  onApplyMitigation,
  isSimulating,
  appliedMitigations,
  cohortName,
  primaryGuest,
  activeBookingRef,
  onNavigateTab,
}) => {
  const [activeOrderTab, setActiveOrderTab] = React.useState<1 | 2 | 3>(1);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'transport':
        return 'directions_car';
      case 'hospitality':
        return 'hotel';
      case 'attraction':
        return 'explore';
      case 'workforce':
        return 'badge';
      case 'revenue':
        return 'payments';
      default:
        return 'hub';
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentEffects: CascadingEffectNode[] =
    activeOrderTab === 1
      ? simulationResult?.firstOrderEffects || []
      : activeOrderTab === 2
      ? simulationResult?.secondOrderEffects || []
      : simulationResult?.thirdOrderEffects || [];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-slate-900 flex flex-col gap-6 shadow-2xs">
      {/* Section 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">tune</span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              What-If Environmental Simulation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust weather parameters to simulate multi-order cascading ripple effects across bookings & routes
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-medium text-slate-600">Isolated Virtual Sandbox</span>
        </div>
      </div>

      {/* Section 2: Preset Scenarios */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Scenario Presets
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {PRESET_SCENARIOS.map(preset => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`material-symbols-outlined text-[19px] ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {preset.icon}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-xs font-bold leading-tight">{preset.label}</div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Interactive Sliders */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Rainfall Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Rainfall</span>
            <span className="font-mono text-blue-600 font-bold">{rainfall} mm/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            step="1"
            value={rainfall}
            onChange={e => setRainfall(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 mm</span>
            <span>75 mm</span>
            <span>150 mm</span>
          </div>
        </div>

        {/* Wind Speed Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Wind Speed</span>
            <span className="font-mono text-teal-700 font-bold">{windSpeed} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="130"
            step="2"
            value={windSpeed}
            onChange={e => setWindSpeed(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 km/h</span>
            <span>65 km/h</span>
            <span>130 km/h</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Temperature</span>
            <span className="font-mono text-amber-700 font-bold">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="0.5"
            value={temperature}
            onChange={e => setTemperature(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5°C</span>
            <span>28°C</span>
            <span>50°C</span>
          </div>
        </div>

        {/* Storm Duration Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Storm Duration</span>
            <span className="font-mono text-indigo-700 font-bold">{stormDuration} hrs</span>
          </div>
          <input
            type="range"
            min="1"
            max="48"
            step="1"
            value={stormDuration}
            onChange={e => setStormDuration(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1h</span>
            <span>24h</span>
            <span>48h</span>
          </div>
        </div>

        {/* Flood Risk Index Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Flood / Landslide Risk</span>
            <span className="font-mono text-rose-600 font-bold">{floodRisk}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={floodRisk}
            onChange={e => setFloodRisk(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Section 4: Key Predictive Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Resilience */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Resilience Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {simulationResult?.ecosystemHealth ?? 85}%
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                (simulationResult?.riskLevel || 'NORMAL') === 'NORMAL'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : (simulationResult?.riskLevel || 'NORMAL') === 'ELEVATED'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {simulationResult?.riskLevel || 'NORMAL'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Probabilistic ecosystem rating</div>
        </div>

        {/* Transit Delay */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Projected Transit Delay
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            +{simulationResult?.aggregateDelaysMinutes ?? 0}m
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
            95% CI: ±{Math.round((simulationResult?.aggregateDelaysMinutes || 10) * 0.15)}m uncertainty
          </div>
        </div>

        {/* Financial Exposure */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Expense / Risk Exposure
          </span>
          <div className="text-2xl font-bold tracking-tight text-amber-600 mt-1">
            ${(simulationResult?.financialRiskEstimate ?? 240).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Reroute & compensation buffer</div>
        </div>

        {/* Affected Entities */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Impacted Nodes
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {simulationResult?.entitiesAffectedCount ?? 1} / {simulationResult?.totalEntitiesTracked ?? 5}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across fleet, hotels & excursions</div>
        </div>
      </div>

      {/* Section 5: AI Executive Summary */}
      {simulationResult?.aiExecutiveSummary && (
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1.5 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[17px] text-blue-600">psychology</span>
            <span>Gemini AI Synthesis</span>
            {isSimulating && (
              <span className="text-[10px] text-blue-600 font-normal italic animate-pulse">
                (Recalculating...)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            {simulationResult.aiExecutiveSummary}
          </p>
        </div>
      )}

      {/* Section 6: Cascading Impact Graph */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Cascading Impact Graph
          </span>

          {/* Order Tabs */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 w-fit">
            {[
              { id: 1, label: '1st Order: Direct Physics' },
              { id: 2, label: '2nd Order: Operations & Stays' },
              { id: 3, label: '3rd Order: Workforce & Ripple' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveOrderTab(tab.id as any)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeOrderTab === tab.id
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Effect Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentEffects.map((effect, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">
                      {getDomainIcon(effect.affectedDomain)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      {effect.affectedDomain}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityStyle(
                      effect.severity
                    )}`}
                  >
                    {effect.severity}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1">{effect.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {effect.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Probability:</span>
                  <span className="text-slate-900 font-bold">
                    {Math.round(effect.probability * 100)}% ({effect.uncertaintyRange})
                  </span>
                </div>
                <div className="text-[10px] text-slate-700 bg-slate-50 p-2 rounded-lg leading-snug border border-slate-200/80">
                  <span className="font-bold text-slate-900">Mitigation: </span>
                  {effect.mitigationAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Autonomous Mitigation Protocol */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
              <h4 className="text-sm font-bold text-slate-900">
                Actionable Contingency Protocol
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute recommendations directly to re-route active cohorts and notify hotel concierges
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {(simulationResult?.recommendedMitigations || []).map(mit => {
            const isApplied = appliedMitigations.includes(mit.id) || mit.status === 'applied';

            return (
              <div
                key={mit.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-xl hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">{mit.action}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{mit.impactTarget}</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      +{mit.riskReductionPercent}% Risk Absorption
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onApplyMitigation(mit.id, mit.action)}
                    disabled={isApplied}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isApplied ? 'check_circle' : 'bolt'}
                    </span>
                    <span>{isApplied ? 'Committed to Live System' : 'Apply to Active Cohort'}</span>
                  </button>
                  {isApplied && onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('alerts')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                      title="View Disruption Alerts Radar"
                    >
                      View in Alerts
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
