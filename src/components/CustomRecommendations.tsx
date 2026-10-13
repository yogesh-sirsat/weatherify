import React, { FC, useEffect, useRef, useState } from "react";
import getAudioFeatures from "@/utils/audioFeatures";
import Genres from "./Genres";
import { CustomAudioFeatures, RecommendationPriority } from "@/types/spotify";
import { WeatherStatus } from "@/types/weather";
import { activityPresets, moodPresets } from "@/utils/moodActivityPresets";

interface CustomRecommendationsProps {
  weatherStatus: WeatherStatus | null;
  priority: RecommendationPriority;
  selectedGenres: Set<string>;
  setSelectedGenres: React.Dispatch<React.SetStateAction<Set<string>>>;
  onGenerate: (features: CustomAudioFeatures, discoverNewMusic: boolean, trackCount: number) => void;
  isProcessing: boolean;
  trackCount: number;
  setTrackCount: (count: number) => void;
}

const defaultFeatures: CustomAudioFeatures = {
  valence: 0.55,
  energy: 0.55,
  tempo: 105,
  instrumentalness: 0.25,
  danceability: 0.58,
  acousticness: 0.4,
  key: 5,
  mode: 1,
  liveness: 0.2,
  loudness: -8,
  speechiness: 0.08,
  popularity: 50,
  duration_ms: 210000,
  time_signature: 4,
};

const featureFields: Array<{
  key: keyof CustomAudioFeatures;
  label: string;
  description: string;
  percent?: boolean;
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
}> = [
  { key: "danceability", label: "Danceability", description: "How easy it feels to dance to the track.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "energy", label: "Energy", description: "How intense and active the track feels.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "valence", label: "Valence", description: "How bright, cheerful, or positive the track feels.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "acousticness", label: "Acousticness", description: "How much the track sounds like it uses acoustic instruments.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "instrumentalness", label: "Instrumentalness", description: "How likely the track is to be mostly instrumental rather than vocal.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "liveness", label: "Liveness", description: "How likely the recording is to sound like a live performance.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "speechiness", label: "Speechiness", description: "How much spoken-word content the track has.", percent: true, min: 0, max: 1, step: 0.01 },
  { key: "tempo", label: "Tempo (BPM)", description: "The estimated speed or pace of the track.", min: 40, max: 220, step: 1 },
  { key: "loudness", label: "Loudness (dB)", description: "The track's overall relative loudness. Typical values are between -60 and 0 dB.", min: -60, max: 0, step: 1 },
  { key: "popularity", label: "Popularity", description: "A target from 0 to 100 based on how popular a track is on Spotify.", min: 0, max: 100, step: 1 },
  { key: "duration_ms", label: "Duration (seconds)", description: "The target length of each track.", min: 30000, max: 600000, step: 1000, format: (value) => `${Math.round(value / 1000)}s` },
  { key: "time_signature", label: "Time signature", description: "The estimated beats per bar, usually 3/4, 4/4, or another meter.", min: 3, max: 7, step: 1 },
  { key: "key", label: "Key", description: "The track's musical home base. You do not need to know music theory: leave it alone for a natural mix, or change it when you want to nudge the playlist toward a different tonal feel.", min: 0, max: 11, step: 1 },
  { key: "mode", label: "Mode", description: "The overall scale mood: minor often feels moodier, while major often feels brighter.", format: (value) => value === 1 ? "Major" : "Minor", min: 0, max: 1, step: 1 },
];

type PresetOption = {
  value: string;
  label: string;
  kind: "balanced" | "weather" | "time" | "mood" | "activity";
  features?: CustomAudioFeatures;
};

const presetOptions: PresetOption[] = [
  { value: "balanced", label: "Balanced", kind: "balanced" },
  { value: "weather", label: "Weather", kind: "weather" },
  { value: "time", label: "Time", kind: "time" },
  ...moodPresets.map((item) => ({ value: `mood:${item.id}`, label: `Mood: ${item.label}`, kind: "mood" as const, features: item.features })),
  ...activityPresets.map((item) => ({ value: `activity:${item.id}`, label: `Activity: ${item.label}`, kind: "activity" as const, features: item.features })),
];

const CustomRecommendations: FC<CustomRecommendationsProps> = ({
  weatherStatus,
  priority,
  selectedGenres,
  setSelectedGenres,
  onGenerate,
  isProcessing,
  trackCount,
  setTrackCount,
}) => {
  const [features, setFeatures] = useState<CustomAudioFeatures>(defaultFeatures);
  const [preset, setPreset] = useState("balanced");
  const [presetQuery, setPresetQuery] = useState("Balanced");
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [discoverNewMusic, setDiscoverNewMusic] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const presetRef = useRef<HTMLDivElement>(null);
  const [openHelp, setOpenHelp] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!presetRef.current?.contains(event.target as Node)) setIsPresetMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const filteredPresets = presetOptions.filter((option) => option.label.toLowerCase().includes(presetQuery.toLowerCase()));
  const selectPreset = (value: string) => {
    const option = presetOptions.find((item) => item.value === value);
    if (!option) return;
    setPreset(option.value);
    setPresetQuery(option.label);
    setIsPresetMenuOpen(false);
  };

  const updateFeature = (key: keyof CustomAudioFeatures, value: number) => {
    setPreset("custom");
    setPresetQuery("Custom");
    setFeatures((current) => ({ ...current, [key]: value }));
  };

  const markCustom = () => {
    setPreset("custom");
    setPresetQuery("Custom");
  };

  const importPreset = async () => {
    const selectedPreset = presetOptions.find((option) => option.value === preset);
    if (!selectedPreset || (selectedPreset.kind === "weather" || selectedPreset.kind === "time") && !weatherStatus) return;
    setIsImporting(true);
    try {
      const imported = selectedPreset.features || await getAudioFeatures(
        weatherStatus?.time_period || "Midday",
        weatherStatus?.main || "Clear Sky",
        selectedPreset.kind === "weather" ? "Weather" : selectedPreset.kind === "time" ? "Time" : "Balanced"
      );
      setFeatures((current) => ({ ...current, ...imported }));
    } finally {
      setIsImporting(false);
    }
  };

  const resetFeatures = () => {
    setFeatures(defaultFeatures);
    markCustom();
  };

  return (
    <section className="w-full max-w-4xl rounded-box bg-base-200 p-4 shadow-md">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-accent">User x Custom</h1>
          <p className="text-sm opacity-70">Tune Spotify&apos;s recommendation targets, or import a weather, time, mood, or activity preset and make it yours.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" type="button" onClick={resetFeatures}>Reset</button>
          <button className="btn btn-outline btn-accent btn-sm" type="button" onClick={importPreset} disabled={isImporting || !presetOptions.some((option) => option.value === preset) || !weatherStatus && ["weather", "time"].includes(preset)}>
            {isImporting ? <span className="loading loading-spinner loading-xs" /> : "Import preset"}
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="form-control relative" ref={presetRef}>
          <label className="label py-0"><span className="label-text font-semibold">Search presets</span></label>
          <input
            className="input input-bordered input-sm"
            role="combobox"
            aria-expanded={isPresetMenuOpen}
            aria-controls="recommendation-preset-options"
            aria-autocomplete="list"
            value={presetQuery}
            onFocus={() => setIsPresetMenuOpen(true)}
            onChange={(event) => {
              const query = event.target.value;
              const exactMatch = presetOptions.find((option) => option.label.toLowerCase() === query.toLowerCase());
              setPresetQuery(query);
              if (exactMatch) setPreset(exactMatch.value);
              setActivePresetIndex(0);
              setIsPresetMenuOpen(true);
            }}
            onKeyDown={(event) => {
              if (!isPresetMenuOpen || filteredPresets.length === 0) return;
              if (event.key === "ArrowDown") { event.preventDefault(); setActivePresetIndex((index) => Math.min(index + 1, filteredPresets.length - 1)); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActivePresetIndex((index) => Math.max(index - 1, 0)); }
              if (event.key === "Enter") { event.preventDefault(); selectPreset(filteredPresets[activePresetIndex].value); }
              if (event.key === "Escape") setIsPresetMenuOpen(false);
            }}
            placeholder="Search presets"
          />
          {isPresetMenuOpen && <ul id="recommendation-preset-options" role="listbox" className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-lg">
            {filteredPresets.length > 0 ? filteredPresets.map((option, index) => <li key={option.value} role="option" aria-selected={preset === option.value} className={`cursor-pointer rounded px-3 py-2 text-sm hover:bg-base-200 ${index === activePresetIndex ? "bg-base-200" : ""}`} onMouseDown={(event) => { event.preventDefault(); selectPreset(option.value); }}>{option.label}</li>) : <li className="px-3 py-2 text-sm opacity-60">No matching presets</li>}
          </ul>}
        </div>
        <div className="relative flex items-end justify-between gap-2">
          <label className="label cursor-pointer gap-3 rounded-lg border border-base-300 px-3">
            <span className="label-text">Discover new music</span>
            <input className="toggle toggle-accent" type="checkbox" checked={discoverNewMusic} onChange={(event) => { markCustom(); setDiscoverNewMusic(event.target.checked); }} />
          </label>
          <button className="btn btn-ghost btn-sm btn-square" type="button" aria-label="Show recommendation information" aria-expanded={showInfo} onClick={() => setShowInfo((current) => !current)}>
            <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full border border-current font-sans text-[10px] font-semibold leading-none normal-case">i</span>
          </button>
          {showInfo && <div className="absolute right-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-box border border-info/40 bg-base-100 p-3 text-sm shadow-2xl">
            <p>Spotify requires at least one seed. Selecting genres sends genre seeds instead of your recent top-artist seeds; it can broaden discovery, but Spotify does not guarantee every result is unfamiliar. With no genres and discovery off, Weatherify uses your top artists.</p>
          </div>}
        </div>
      </div>

      <div className="mb-5 rounded-box bg-base-100 p-4">
        <Genres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} onInteraction={markCustom} />
      </div>

      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
        {featureFields.map((field) => {
          const value = features[field.key];
          return (
            <label className="form-control" key={field.key}>
              <div className="relative flex items-center justify-between gap-2">
                <span className="label-text font-semibold">{field.label}</span>
                <div className="flex items-center gap-2">
                  <output className="badge badge-ghost">{field.percent ? `${Math.round(value * 100)}%` : field.format ? field.format(value) : value}</output>
                  <button className="btn btn-ghost btn-xs btn-square" type="button" aria-label={`Show information for ${field.label}`} onClick={() => setOpenHelp(openHelp === field.key ? null : field.key)}>
                    <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full border border-current font-sans text-[10px] font-semibold leading-none normal-case">i</span>
                  </button>
                </div>
                {openHelp === field.key && <div className="absolute right-0 top-8 z-30 w-64 rounded-box border border-base-300 bg-base-100 p-3 text-sm font-normal shadow-xl"><p>{field.description}</p><button className="btn btn-ghost btn-xs mt-2" type="button" onClick={() => setOpenHelp(null)}>Close</button></div>}
              </div>
              <input className="range range-accent range-sm" type="range" min={field.percent ? 0 : field.min} max={field.percent ? 100 : field.max} step={field.percent ? 1 : field.step} value={field.percent ? Math.round(value * 100) : value} onChange={(event) => updateFeature(field.key, field.percent ? Number(event.target.value) / 100 : Number(event.target.value))} />
            </label>
          );
        })}
      </div>

      <label className="mt-6 flex flex-col gap-2 rounded-box bg-base-100 p-4">
        <span className="flex items-center justify-between gap-2 font-semibold"><span>How many tracks?</span><output className="badge badge-primary">{trackCount}</output></span>
        <span className="text-xs opacity-70">Choose the size of the generated playlist.</span>
        <input className="range range-primary range-sm" type="range" min="5" max="100" step="5" value={trackCount} onChange={(event) => { markCustom(); setTrackCount(Number(event.target.value)); }} />
        <span className="flex justify-between text-xs opacity-60"><span>5 tracks</span><span>100 tracks</span></span>
      </label>

      <button className="btn btn-primary mt-6 w-full" type="button" disabled={isProcessing} onClick={() => onGenerate(features, discoverNewMusic, trackCount)}>
        {isProcessing ? <><span className="loading loading-spinner loading-sm" />Generating...</> : "Generate custom playlist"}
      </button>
    </section>
  );
};

export default CustomRecommendations;
