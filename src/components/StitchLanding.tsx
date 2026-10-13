"use client";

import React, { useState, FC } from "react";

interface StitchLandingProps {
  onConnectSpotify: () => void;
}

interface TrackItem {
  title: string;
  artist: string;
  time: string;
  cover: string;
}

interface SimulatorMode {
  title: string;
  desc: string;
  key: string;
  icon: string;
  valence: string;
  valencePct: string;
  energy: string;
  energyPct: string;
  tempo: string;
  tempoPct: string;
  acoustic: string;
  acousticPct: string;
  dance: string;
  dancePct: string;
  harmonic: string;
  freq: string;
  tracks: Array<TrackItem>;
}

const REAL_COVERS = {
  heartbreak: "/landing-page/music-covers/welcome-to-the-heartbreak-kanye-west.webp",
  runaway: "/landing-page/music-covers/runaway-kanye-west.webp",
  goodMorning: "/landing-page/music-covers/good-morning-kanye-west.webp",
  allFallsDown: "/landing-page/music-covers/all-falls-down-kanye-west.webp",
  allTheLove: "/landing-page/music-covers/all-the-love-kanye-west.webp",
};

// Modeled directly on src/utils/audioFeatures.ts formulas and values
const SIMULATOR_MODES: Record<number, SimulatorMode> = {
  1: {
    title: "Rainy Twilight",
    desc: "Precipitation drizzle â€¢ Circadian late evening / night transition",
    key: "Key: D Minor",
    icon: "water_drop",
    valence: "0.35",
    valencePct: "35%",
    energy: "0.36",
    energyPct: "36%",
    tempo: "86 BPM",
    tempoPct: "43%",
    acoustic: "0.74",
    acousticPct: "74%",
    dance: "0.42",
    dancePct: "42%",
    harmonic: "Minor (Key: 2 / Dm)",
    freq: "Warm Acoustic & Lo-Fi Timbre",
    tracks: [
      {
        title: "Welcome to Heartbreak",
        artist: "Kanye West ft. Kid Cudi",
        time: "4:23",
        cover: REAL_COVERS.heartbreak,
      },
      {
        title: "Runaway",
        artist: "Kanye West ft. Pusha T",
        time: "9:08",
        cover: REAL_COVERS.runaway,
      },
      {
        title: "All Falls Down",
        artist: "Kanye West ft. Syleena Johnson",
        time: "3:43",
        cover: REAL_COVERS.allFallsDown,
      },
      {
        title: "Good Morning",
        artist: "Kanye West",
        time: "3:15",
        cover: REAL_COVERS.goodMorning,
      },
      {
        title: "All the Love",
        artist: "Kanye West",
        time: "3:32",
        cover: REAL_COVERS.allTheLove,
      },
    ],
  },
  2: {
    title: "Sunny Midday",
    desc: "Clear sky high noon â€¢ Circadian midday peak alertness",
    key: "Key: C Major",
    icon: "light_mode",
    valence: "0.82",
    valencePct: "82%",
    energy: "0.72",
    energyPct: "72%",
    tempo: "122 BPM",
    tempoPct: "61%",
    acoustic: "0.20",
    acousticPct: "20%",
    dance: "0.72",
    dancePct: "72%",
    harmonic: "Major (Key: 0 / C)",
    freq: "High Treble Sparkle & Punch",
    tracks: [
      {
        title: "Good Morning",
        artist: "Kanye West",
        time: "3:15",
        cover: REAL_COVERS.goodMorning,
      },
      {
        title: "All Falls Down",
        artist: "Kanye West ft. Syleena Johnson",
        time: "3:43",
        cover: REAL_COVERS.allFallsDown,
      },
      {
        title: "All the Love",
        artist: "Kanye West",
        time: "3:32",
        cover: REAL_COVERS.allTheLove,
      },
      {
        title: "Runaway",
        artist: "Kanye West ft. Pusha T",
        time: "9:08",
        cover: REAL_COVERS.runaway,
      },
      {
        title: "Welcome to Heartbreak",
        artist: "Kanye West ft. Kid Cudi",
        time: "4:23",
        cover: REAL_COVERS.heartbreak,
      },
    ],
  },
  3: {
    title: "Electric Storm",
    desc: "Active thunderstorm â€¢ High adrenaline kinetic charge",
    key: "Key: E Minor",
    icon: "thunderstorm",
    valence: "0.34",
    valencePct: "34%",
    energy: "0.88",
    energyPct: "88%",
    tempo: "138 BPM",
    tempoPct: "69%",
    acoustic: "0.12",
    acousticPct: "12%",
    dance: "0.58",
    dancePct: "58%",
    harmonic: "Minor (Key: 4 / Em)",
    freq: "Driving Dynamic Bass & Overdrive",
    tracks: [
      {
        title: "Runaway",
        artist: "Kanye West ft. Pusha T",
        time: "9:08",
        cover: REAL_COVERS.runaway,
      },
      {
        title: "Welcome to Heartbreak",
        artist: "Kanye West ft. Kid Cudi",
        time: "4:23",
        cover: REAL_COVERS.heartbreak,
      },
      {
        title: "All Falls Down",
        artist: "Kanye West ft. Syleena Johnson",
        time: "3:43",
        cover: REAL_COVERS.allFallsDown,
      },
      {
        title: "All the Love",
        artist: "Kanye West",
        time: "3:32",
        cover: REAL_COVERS.allTheLove,
      },
      {
        title: "Good Morning",
        artist: "Kanye West",
        time: "3:15",
        cover: REAL_COVERS.goodMorning,
      },
    ],
  },
};

// Canonical 33 genres from src/components/Genres.tsx
const ALL_33_GENRES = [
  "acoustic", "ambient", "anime", "chill", "classical", "club",
  "country", "dance", "death-metal", "edm", "electronic", "folk",
  "funk", "groove", "guitar", "heavy-metal", "hip-hop", "indie",
  "indie-pop", "jazz", "k-pop", "metal", "opera", "party",
  "piano", "pop", "rock", "rock-n-roll", "r-n-b", "reggae",
  "soul", "trance", "trip-hop"
];

const StitchLanding: FC<StitchLandingProps> = ({ onConnectSpotify }) => {
  const [activeSimMode, setActiveSimMode] = useState<number>(1);
  const [priorityType, setPriorityType] = useState<"weather" | "balanced" | "time">("balanced");
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(
    new Set(["chill", "indie", "ambient"])
  );

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) {
        next.delete(genre);
      } else {
        if (next.size < 5) {
          next.add(genre);
        }
      }
      return next;
    });
  };

  const curSim = SIMULATOR_MODES[activeSimMode] || SIMULATOR_MODES[1];

  // Weights derived from audioFeatures.ts:
  // Weather: weather_weight = 2.2, time_weight = 0.8 (73.3% / 26.7%)
  // Balanced: weather_weight = 1.5, time_weight = 1.5 (50.0% / 50.0%)
  // Time: weather_weight = 0.8, time_weight = 2.2 (26.7% / 73.3%)
  const prioWeights = {
    weather: { weather: "73%", time: "27%", formula: "Weather 2.2x â€¢ Time 0.8x" },
    balanced: { weather: "50%", time: "50%", formula: "Weather 1.5x â€¢ Time 1.5x" },
    time: { weather: "27%", time: "73%", formula: "Weather 0.8x â€¢ Time 2.2x" }
  }[priorityType];

  return (
    <div
      data-theme="synthwave"
      className="synthwave-landing bg-landing-background font-body-md text-body-md text-on-surface antialiased min-h-screen selection:bg-landing-primary-container selection:text-on-primary-container"
    >
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(231,121,193,0.18)]">
        <div className="h-20 w-full px-margin flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-space-md">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-landing-secondary to-landing-primary-container p-0.5 flex items-center justify-center shadow-[0_0_16px_rgba(231,121,193,0.5)] group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-landing-base-100 rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-landing-secondary text-[24px]">airwave</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-2xl font-black text-on-surface tracking-tight leading-none group-hover:text-landing-primary transition-colors">
                  Weatherify
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mt-1">
                  Atmospheric Soundscapes
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low/70 border border-white/5">
            <a
              className="px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
              href="#how-it-works"
            >
              How It Works
            </a>
            <a
              className="px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
              href="#simulator"
            >
              Live Vibe Simulator
            </a>
            <a
              className="px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
              href="#personalization"
            >
              Personalization
            </a>
            <a
              className="px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
              href="#features"
            >
              Features
            </a>
          </nav>

          {/* CTA Button (Strict Spotify Brand Guidelines: White icon on Green button - Hidden on small mobile to avoid crowding logo) */}
          <div className="flex items-center">
            <button
              onClick={onConnectSpotify}
              className="group hidden sm:inline-flex items-center gap-2.5 bg-[#1DB954] text-white px-5 py-2.5 rounded-full font-label-md text-label-md hover:bg-[#1ed760] hover:shadow-[0_0_20px_rgba(29,185,84,0.6)] transition-all cursor-pointer font-bold tracking-wide"
              type="button"
            >
              <img
                src="/spotify_icons/Spotify_Icon_RGB_White.png"
                alt="Spotify"
                className="w-5 h-5 object-contain"
              />
              <span>Connect with Spotify</span>
            </button>
          </div>
        </div>
      </header>
      <main className="w-full pt-20 bg-landing-background">
        <div className="flex flex-col w-full">
{/*  SECTION 1: HERO SECTION ("Atmospheric Soundscape Portal")  */}
<section className="relative w-full overflow-hidden px-margin-mobile md:px-margin py-16 lg:py-28 flex flex-col items-center justify-center">
  {/* Atmospheric Ambient Glow Blobs */}
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[450px] bg-gradient-to-tr from-landing-primary-container/25 via-landing-secondary/20 to-landing-tertiary/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
  <div className="absolute top-1/3 -left-48 w-96 h-96 bg-landing-primary-container/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
  <div className="absolute top-1/2 -right-48 w-96 h-96 bg-landing-secondary/20 blur-[110px] rounded-full pointer-events-none -z-10"></div>

  <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
    {/* Left Column: Copy & Core CTAs */}
    <div className="w-full lg:w-7/12 flex flex-col items-start gap-6 text-left">
      {/* Live Neon Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/90 shadow-[0_0_24px_rgba(231,121,193,0.35)] border border-landing-primary/20">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-landing-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-landing-primary"></span>
        </span>
        <span className="font-label-sm text-xs font-semibold uppercase tracking-widest text-landing-primary-fixed-dim">
          Weather Ã— Circadian Ã— Spotify Intelligence
        </span>
      </div>

      {/* Main Headline (Larger, more prominent) */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.1] max-w-3xl">
        Your Soundtrack, <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-landing-primary-container via-landing-secondary to-landing-tertiary bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(231,121,193,0.45)]">
          Tuned by the Sky
        </span>{" "}
        and the Hour.
      </h1>

      {/* Subheadline */}
      <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl leading-relaxed">
        Real-time atmospheric conditions and circadian biorhythms meet Spotify audio intelligence to curate personal, high-fidelity sonic experiences synchronized with your exact moment.
      </p>

      {/* CTA Cluster */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
        <button
          onClick={onConnectSpotify}
          className="inline-flex items-center justify-center gap-3 bg-[#1DB954] text-white px-8 py-4 rounded-full font-label-lg text-base shadow-[0_0_25px_rgba(29,185,84,0.55)] hover:shadow-[0_0_35px_rgba(29,185,84,0.85)] hover:bg-[#1ed760] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-bold tracking-wide"
        >
          <img
            alt="Spotify Icon"
            className="w-6 h-6 object-contain"
            src="/spotify_icons/Spotify_Icon_RGB_White.png"
          />
          <span>Connect with Spotify</span>
        </button>

        <a
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-label-lg text-base text-landing-secondary bg-surface-container/80 hover:bg-surface-container-high transition-all shadow-md border border-white/5"
          href="#simulator"
        >
          <span className="material-symbols-outlined text-landing-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_circle
          </span>
          <span>Explore Live Vibe Demo</span>
        </a>
      </div>

      {/* Trust Micro-Copy */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-label-sm text-xs text-on-surface-variant/80 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#1DB954] text-[16px]">check_circle</span>
          No credit card required
        </span>
        <span className="text-outline">â€¢</span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-landing-secondary text-[16px]">security</span>
          Direct Spotify PKCE OAuth
        </span>
        <span className="text-outline">â€¢</span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-landing-primary text-[16px]">bolt</span>
          Dynamic 20-track curation
        </span>
      </div>
    </div>

    {/* Right Column: Live Atmospheric Vibe Card */}
    <div className="w-full lg:w-5/12 relative">
      {/* Glow Backplate */}
      <div className="absolute inset-0 bg-gradient-to-br from-landing-primary-container/20 to-landing-secondary/20 blur-2xl -z-10 rounded-2xl"></div>
      <div className="w-full bg-landing-base-200/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_16px_40px_rgba(21,5,67,0.7)] flex flex-col gap-4 border border-white/10">
        {/* Card Top Telemetry */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-landing-secondary font-label-md text-sm font-semibold">
            <span className="material-symbols-outlined text-landing-secondary text-[18px]">location_on</span>
            <span>Seattle, WA</span>
            <span className="text-outline">â€¢</span>
            <span className="text-landing-tertiary">14Â°C</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-landing-info text-[15px]">cloudy_snowing</span>
            <span>Rain</span>
            <span className="text-outline">|</span>
            <span className="text-landing-secondary font-bold">21:42 Local</span>
          </div>
        </div>

        {/* Circadian Phase Indicator Pill */}
        <div className="w-full bg-surface-container-lowest/80 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-landing-tertiary text-[20px]">bedtime</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Circadian Phase</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">Night Relaxation</span>
            </div>
          </div>
          <span className="font-label-sm text-xs px-2.5 py-1 rounded-full bg-landing-primary/20 text-landing-primary-fixed-dim font-bold">
            Key: D Minor
          </span>
        </div>

        {/* Sonic Trait Equalizer Grid (Aligned with Rain in audioFeatures.ts) */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 py-1">
          <div className="flex flex-col items-center bg-surface-container-low/70 rounded-lg p-2 text-center">
            <span className="font-label-sm text-[11px] text-on-surface-variant">BPM</span>
            <span className="font-headline-sm text-base text-landing-secondary font-bold">86</span>
            <div className="w-full bg-landing-base-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-landing-secondary h-full rounded-full" style={{ width: "43%" }}></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low/70 rounded-lg p-2 text-center">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Valence</span>
            <span className="font-headline-sm text-base text-landing-primary font-bold">35%</span>
            <div className="w-full bg-landing-base-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-landing-primary h-full rounded-full" style={{ width: "35%" }}></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low/70 rounded-lg p-2 text-center">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Energy</span>
            <span className="font-headline-sm text-base text-landing-secondary font-bold">36%</span>
            <div className="w-full bg-landing-base-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-landing-secondary h-full rounded-full" style={{ width: "36%" }}></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low/70 rounded-lg p-2 text-center">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Dance</span>
            <span className="font-headline-sm text-base text-landing-tertiary font-bold">42%</span>
            <div className="w-full bg-landing-base-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-landing-tertiary h-full rounded-full" style={{ width: "42%" }}></div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low/70 rounded-lg p-2 text-center col-span-3 sm:col-span-1">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Acoustic</span>
            <span className="font-headline-sm text-base text-landing-primary font-bold">74%</span>
            <div className="w-full bg-landing-base-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-landing-primary h-full rounded-full" style={{ width: "74%" }}></div>
            </div>
          </div>
        </div>

        {/* Active Seed Genres */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-label-sm text-xs text-on-surface-variant pr-1">Seeds:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-label-sm text-xs text-landing-secondary font-medium">chill</span>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-label-sm text-xs text-landing-primary font-medium">indie</span>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-label-sm text-xs text-landing-tertiary font-medium">ambient</span>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-label-sm text-xs text-on-surface font-medium">piano</span>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-label-sm text-xs text-on-surface-variant font-medium">jazz</span>
        </div>

        {/* Mini Player Preview */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high relative overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md">
              <img className="w-full h-full object-cover" alt="Welcome to Heartbreak" src={REAL_COVERS.heartbreak} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-md text-sm font-semibold text-on-surface truncate">Welcome to Heartbreak</span>
              <span className="font-body-sm text-xs text-on-surface-variant truncate">Kanye West ft. Kid Cudi</span>
            </div>
          </div>
          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-6 pr-2 flex-shrink-0">
            <span className="w-1 bg-[#1DB954] rounded-full animate-bounce h-3"></span>
            <span className="w-1 bg-[#1DB954] rounded-full animate-bounce h-5" style={{ animationDelay: "0.15s" }}></span>
            <span className="w-1 bg-[#1DB954] rounded-full animate-bounce h-2" style={{ animationDelay: "0.3s" }}></span>
            <span className="w-1 bg-[#1DB954] rounded-full animate-bounce h-6" style={{ animationDelay: "0.45s" }}></span>
            <span className="w-1 bg-[#1DB954] rounded-full animate-bounce h-4" style={{ animationDelay: "0.2s" }}></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  SECTION 2: THE TRI-FACTOR FORMULA ("How Weatherify Works")  */}
<section className="w-full px-margin-mobile md:px-margin py-20 lg:py-28 bg-surface-container-lowest/50 relative" id="how-it-works">
  <div className="w-full max-w-7xl mx-auto flex flex-col gap-14">
    {/* Section Header */}
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
      <span className="font-label-md text-sm uppercase tracking-widest text-landing-secondary font-bold">
        Acoustic Synthesis Pipeline
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-on-surface">Three Signals. One Seamless Vibe.</h2>
      <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
        Weatherify combines live weather conditions, the time of day, and your selected Spotify seeds to calculate target audio parameters for music discovery.
      </p>
    </div>

    {/* 3 Column Bento Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 01: Atmosphere */}
      <div className="group relative bg-surface-container-low hover:bg-surface-container p-7 rounded-2xl transition-all duration-300 shadow-xl flex flex-col justify-between gap-6 overflow-hidden border border-white/5">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-landing-secondary/15 rounded-full blur-2xl group-hover:bg-landing-secondary/30 transition-all"></div>
        <div className="flex flex-col gap-4 z-10">
          <div className="w-14 h-14 rounded-xl bg-landing-secondary/15 flex items-center justify-center text-landing-secondary shadow-[0_0_20px_rgba(88,199,243,0.3)]">
            <span className="material-symbols-outlined text-[32px]">air</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-xs text-landing-secondary uppercase tracking-widest font-bold">Signal 01</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Atmosphere (Weather)</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Live weather conditions (Rain, Clear Sky, Clouds, Thunderstorm, Snow) drive baseline valence, energy, and acousticness targets.
          </p>
        </div>
        <div className="z-10 bg-surface-container-lowest/80 p-3.5 rounded-xl flex items-center justify-between text-on-surface-variant font-label-sm text-xs">
          <span>Weather Provider:</span>
          <span className="text-landing-secondary font-bold">OpenWeatherMap API</span>
        </div>
      </div>

      {/* Card 02: Circadian Rhythm */}
      <div className="group relative bg-surface-container-low hover:bg-surface-container p-7 rounded-2xl transition-all duration-300 shadow-xl flex flex-col justify-between gap-6 overflow-hidden border border-white/5">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-landing-primary-container/15 rounded-full blur-2xl group-hover:bg-landing-primary-container/30 transition-all"></div>
        <div className="flex flex-col gap-4 z-10">
          <div className="w-14 h-14 rounded-xl bg-landing-primary-container/15 flex items-center justify-center text-landing-primary shadow-[0_0_20px_rgba(231,121,193,0.3)]">
            <span className="material-symbols-outlined text-[32px]">schedule</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-xs text-landing-primary uppercase tracking-widest font-bold">Signal 02</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Circadian Rhythm (Time)</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Divides the 24-hour cycle into 11 circadian periods (Morning, Midday, Evening, Night) to modulate tempo and energy to match your daily routine.
          </p>
        </div>
        <div className="z-10 bg-surface-container-lowest/80 p-3.5 rounded-xl flex items-center justify-between text-on-surface-variant font-label-sm text-xs">
          <span>Circadian Resolution:</span>
          <span className="text-landing-primary font-bold">11 Time Periods</span>
        </div>
      </div>

      {/* Card 03: Spotify Personal Taste */}
      <div className="group relative bg-surface-container-low hover:bg-surface-container p-7 rounded-2xl transition-all duration-300 shadow-xl flex flex-col justify-between gap-6 overflow-hidden border border-white/5">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-landing-tertiary/15 rounded-full blur-2xl group-hover:bg-landing-tertiary/30 transition-all"></div>
        <div className="flex flex-col gap-4 z-10">
          <div className="w-14 h-14 rounded-xl bg-landing-tertiary/15 flex items-center justify-center text-landing-tertiary shadow-[0_0_20px_rgba(234,195,38,0.3)]">
            <span className="material-symbols-outlined text-[32px]">equalizer</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-xs text-landing-tertiary uppercase tracking-widest font-bold">Signal 03</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Musical Seeds (Taste)</h3>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Pick up to 5 genres from 33 canonical Spotify seeds or let your listening history anchor the soundscape so recommendations stay authentic to you.
          </p>
        </div>
        <div className="z-10 bg-surface-container-lowest/80 p-3.5 rounded-xl flex items-center justify-between text-on-surface-variant font-label-sm text-xs">
          <span>Seed Limit:</span>
          <span className="text-landing-tertiary font-bold">Up to 5 Genre Seeds</span>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  SECTION 3: LIVE VIBE SIMULATOR & AUDIO TRAIT SPECTRUM  */}
<section className="w-full px-margin-mobile md:px-margin py-20 lg:py-28 relative overflow-hidden" id="simulator">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-landing-primary-container/10 blur-[140px] pointer-events-none rounded-full"></div>
  <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
    {/* Section Header */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col gap-2 max-w-2xl">
        <span className="font-label-md text-sm uppercase tracking-widest text-landing-primary font-bold">
          Interactive Parameter Engine
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-on-surface">Live Vibe Simulator</h2>
        <p className="font-body-md text-base text-on-surface-variant">
          Toggle weather conditions to preview the real target audio features calculated by Weatherify's audio engine.
        </p>
      </div>

      {/* Mode Toggle Tabs (Responsive compact sizing on mobile) */}
      <div className="inline-flex flex-wrap sm:flex-nowrap p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-surface-container-low border border-white/5 gap-1 self-stretch sm:self-auto justify-center">
        <button
          onClick={() => setActiveSimMode(1)}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-label-md text-xs sm:text-sm font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
            activeSimMode === 1
              ? "bg-landing-primary-container text-on-primary-container shadow-[0_0_16px_rgba(231,121,193,0.5)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          id="sim-tab-1"
        >
          Rainy Twilight
        </button>
        <button
          onClick={() => setActiveSimMode(2)}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-label-md text-xs sm:text-sm font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
            activeSimMode === 2
              ? "bg-landing-primary-container text-on-primary-container shadow-[0_0_16px_rgba(231,121,193,0.5)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          id="sim-tab-2"
        >
          Sunny Midday
        </button>
        <button
          onClick={() => setActiveSimMode(3)}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-label-md text-xs sm:text-sm font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
            activeSimMode === 3
              ? "bg-landing-primary-container text-on-primary-container shadow-[0_0_16px_rgba(231,121,193,0.5)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          id="sim-tab-3"
        >
          Electric Storm
        </button>
      </div>
    </div>

    {/* Main Interactive Workbench */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Telemetry Gauges / Sliders (7 Cols) */}
      <div className="lg:col-span-7 bg-surface-container-low/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between gap-6 border border-white/5">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-landing-secondary text-[32px]" id="sim-weather-icon">
              {curSim.icon}
            </span>
            <div>
              <h4 className="font-headline-sm text-lg font-bold text-on-surface" id="sim-mode-title">
                {curSim.title}
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant" id="sim-mode-desc">
                {curSim.desc}
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-surface-container-high font-label-sm text-xs text-landing-secondary font-bold" id="sim-key-pill">
            {curSim.key}
          </span>
        </div>

        {/* Meters Matrix (Direct Audio Feature Values) */}
        <div className="flex flex-col gap-4">
          {/* Valence Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Valence (Mood Positiveness)</span>
              <span className="text-landing-primary font-bold" id="sim-val-valence">{curSim.valence}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-landing-secondary to-landing-primary h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(231,121,193,0.5)]"
                id="sim-bar-valence"
                style={{ width: curSim.valencePct }}
              ></div>
            </div>
          </div>

          {/* Energy Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Energy (Intensity & Drive)</span>
              <span className="text-landing-secondary font-bold" id="sim-val-energy">{curSim.energy}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-landing-secondary to-landing-primary h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(88,199,243,0.5)]"
                id="sim-bar-energy"
                style={{ width: curSim.energyPct }}
              ></div>
            </div>
          </div>

          {/* Tempo Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Tempo Target</span>
              <span className="text-landing-tertiary font-bold" id="sim-val-tempo">{curSim.tempo}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-landing-secondary to-landing-tertiary h-full rounded-full transition-all duration-500"
                id="sim-bar-tempo"
                style={{ width: curSim.tempoPct }}
              ></div>
            </div>
          </div>

          {/* Acousticness Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Acousticness</span>
              <span className="text-landing-primary font-bold" id="sim-val-acoustic">{curSim.acoustic}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-landing-secondary to-landing-primary h-full rounded-full transition-all duration-500"
                id="sim-bar-acoustic"
                style={{ width: curSim.acousticPct }}
              ></div>
            </div>
          </div>

          {/* Danceability Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Danceability</span>
              <span className="text-landing-secondary font-bold" id="sim-val-dance">{curSim.dance}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-landing-secondary to-landing-primary h-full rounded-full transition-all duration-500"
                id="sim-bar-dance"
                style={{ width: curSim.dancePct }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-surface-container-lowest/60 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-landing-tertiary text-[18px]">tune</span>
            <span className="font-label-sm text-xs text-on-surface-variant">Key Mode:</span>
            <span className="font-label-sm text-xs text-landing-tertiary font-bold" id="sim-harmonic-bias">{curSim.harmonic}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-landing-secondary text-[18px]">graphic_eq</span>
            <span className="font-label-sm text-xs text-on-surface-variant">Sonic Texture:</span>
            <span className="font-label-sm text-xs text-landing-secondary font-bold" id="sim-freq-curve">{curSim.freq}</span>
          </div>
        </div>
      </div>

      {/* Live Tracklist Output Drawer (5 Cols) */}
      <div className="lg:col-span-5 bg-surface-container-low/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between gap-4 border border-white/5">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <img alt="Spotify Icon" className="w-5 h-5 object-contain" src="/spotify_icons/Spotify_Icon_RGB_White.png" />
            <h4 className="font-headline-sm text-base font-bold text-on-surface">Curated Preview (5 Tracks)</h4>
          </div>
          <span className="font-label-sm text-xs px-2.5 py-1 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold">
            Interactive Sample
          </span>
        </div>

        {/* Tracks Container (No artificial percentage matches) */}
        <div className="flex flex-col gap-2.5" id="sim-track-list">
          {curSim.tracks.map((track, idx) => (
            <div
              key={`${track.title}-${idx}`}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 shadow">
                  <img className="w-full h-full object-cover" alt={track.title} src={track.cover} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-sm font-semibold text-on-surface truncate">{track.title}</span>
                  <span className="font-body-sm text-xs text-on-surface-variant truncate">{track.artist}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 pl-3">
                <span className="font-label-sm text-xs text-landing-secondary font-mono">{track.time}</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">Track #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Action Button */}
        <button
          onClick={onConnectSpotify}
          className="w-full mt-2 py-3.5 rounded-xl bg-landing-primary-container text-on-primary-container font-label-md text-sm font-bold hover:shadow-[0_0_20px_rgba(231,121,193,0.6)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">queue_music</span>
          <span>Generate Personalized Playlist</span>
        </button>
      </div>
    </div>
  </div>
</section>

{/*  SECTION 4: DEEP PERSONALIZATION & USER BIAS CONTROLS SHOWCASE  */}
<section className="w-full px-margin-mobile md:px-margin py-20 lg:py-28 bg-surface-container-lowest/60 relative" id="personalization">
  <div className="w-full max-w-7xl mx-auto flex flex-col gap-14">
    {/* Section Header */}
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
      <span className="font-label-md text-sm uppercase tracking-widest text-landing-tertiary font-bold">
        Algorithmic Balance
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-on-surface">You Control the Weight.</h2>
      <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
        Choose whether real-time weather conditions or the time of day takes priority when generating your soundtrack.
      </p>
    </div>

    {/* Priority Switch & Genre Cloud Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: 3-Way Priority Switch & Explanation (5 Cols) */}
      <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6 border border-white/5">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-xs text-landing-secondary uppercase tracking-widest font-bold">
            Priority Weights (audioFeatures.ts)
          </span>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">Influence Distribution</h3>
          <p className="font-body-sm text-xs text-on-surface-variant">Select which signal has higher weight in calculating audio traits.</p>
        </div>

        {/* 3-Way Pill Switch */}
        <div className="p-1 sm:p-1.5 rounded-full bg-surface-container-lowest flex items-center justify-between gap-1 shadow-inner border border-white/5">
          <button
            onClick={() => setPriorityType("weather")}
            className={`flex-1 py-2 sm:py-2.5 rounded-full font-label-sm text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
              priorityType === "weather"
                ? "bg-landing-primary-container text-on-primary-container font-bold shadow-[0_0_14px_rgba(231,121,193,0.5)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            id="prio-btn-weather"
          >
            Weather
          </button>
          <button
            onClick={() => setPriorityType("balanced")}
            className={`flex-1 py-2 sm:py-2.5 rounded-full font-label-sm text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
              priorityType === "balanced"
                ? "bg-landing-primary-container text-on-primary-container font-bold shadow-[0_0_14px_rgba(231,121,193,0.5)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            id="prio-btn-balanced"
          >
            Balanced
          </button>
          <button
            onClick={() => setPriorityType("time")}
            className={`flex-1 py-2 sm:py-2.5 rounded-full font-label-sm text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
              priorityType === "time"
                ? "bg-landing-primary-container text-on-primary-container font-bold shadow-[0_0_14px_rgba(231,121,193,0.5)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            id="prio-btn-time"
          >
            Time
          </button>
        </div>

        {/* Visual Distribution Breakdown (Matching actual audioFeatures.ts weights) */}
        <div className="flex flex-col gap-4 bg-surface-container-lowest/80 p-5 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">Formula Calculation:</span>
            <span className="text-on-surface font-mono font-semibold">{prioWeights.formula}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Weather Weight</span>
              <span className="text-landing-secondary font-bold" id="prio-label-weather">{prioWeights.weather}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2 rounded-full overflow-hidden">
              <div className="bg-landing-secondary h-full rounded-full transition-all duration-300" id="prio-bar-weather" style={{ width: prioWeights.weather }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-sm text-xs">
              <span className="text-on-surface-variant">Time / Circadian Weight</span>
              <span className="text-landing-primary font-bold" id="prio-label-time">{prioWeights.time}</span>
            </div>
            <div className="w-full bg-landing-base-300 h-2 rounded-full overflow-hidden">
              <div className="bg-landing-primary h-full rounded-full transition-all duration-300" id="prio-bar-time" style={{ width: prioWeights.time }}></div>
            </div>
          </div>
        </div>

        {/* Feature Note */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-high/40 border border-white/5">
          <span className="material-symbols-outlined text-landing-tertiary text-[20px] flex-shrink-0 mt-0.5">verified</span>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            In <span className="text-on-surface font-semibold">Weather Focus</span>, atmospheric attributes have a 2.2x multiplier and direct key mapping. In <span className="text-on-surface font-semibold">Balanced Mode</span>, time and weather share equal 1.5x weights.
          </p>
        </div>
      </div>

      {/* Right: 33-Curated Genre Tag Pill Matrix (7 Cols) */}
      <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-5 border border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-white/5">
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">33-Genre Matrix</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">Select up to 5 genre seeds to guide your recommendations.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-landing-tertiary/15 text-landing-tertiary font-label-sm text-xs font-bold shadow-[0_0_12px_rgba(234,195,38,0.25)] flex-shrink-0">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span id="genre-counter">{selectedGenres.size} / 5 Selected</span>
          </div>
        </div>

        {/* Stable Genre Tag Pills Cloud (No layout shifting/jumping on click) */}
        <div className="flex flex-wrap gap-2 pt-1" id="genre-cloud">
          {ALL_33_GENRES.map((g) => {
            const isSelected = selectedGenres.has(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`genre-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${
                  isSelected
                    ? "bg-landing-tertiary text-[#150543] font-bold shadow-[0_0_12px_rgba(234,195,38,0.4)]"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-white/5"
                }`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full transition-transform ${
                    isSelected ? "bg-[#150543] scale-100" : "bg-white/20 scale-75"
                  }`}
                />
                <span>{g}</span>
              </button>
            );
          })}
        </div>

        {/* Seed Ceiling Warning Rule Banner */}
        <div className="mt-2 p-3.5 rounded-xl bg-surface-container-lowest/80 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs">
            <span className="material-symbols-outlined text-landing-secondary text-[18px]">info</span>
            <span>Spotify API accepts a maximum of 5 seed parameters per recommendation request.</span>
          </div>
          <button
            onClick={() => setSelectedGenres(new Set())}
            className="font-label-sm text-xs text-landing-secondary hover:underline cursor-pointer flex-shrink-0 ml-3"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  SECTION 5: THEME VERSATILITY SHOWCASE  */}
<section className="w-full px-margin-mobile md:px-margin py-16 lg:py-24 relative" id="features">
  <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-8 md:p-12 rounded-3xl shadow-2xl border border-white/5">
    <div className="flex flex-col gap-2 max-w-lg">
      <div className="inline-flex items-center gap-2 text-landing-primary font-label-sm text-xs uppercase tracking-widest font-bold">
        <span className="material-symbols-outlined text-[16px]">palette</span>
        <span>Semantic Theme Engine</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-on-surface">Synthwave Aesthetic</h3>
      <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
        Engineered with Synthwave neon aesthetics, optimized dark-mode contrast, and responsive typography designed to look crisp on any screen.
      </p>
    </div>

    {/* Theme Badges */}
    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
      <div className="px-4 py-2.5 rounded-xl bg-landing-base-100 shadow-[0_0_16px_rgba(231,121,193,0.4)] flex items-center gap-2 border border-landing-primary/30">
        <span className="w-3.5 h-3.5 rounded-full bg-landing-primary-container"></span>
        <span className="font-label-md text-sm text-on-surface font-bold">Synthwave</span>
      </div>
      <div className="px-4 py-2.5 rounded-xl bg-surface-container-highest/60 flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-landing-secondary"></span>
        <span className="font-label-md text-sm text-on-surface-variant">Cyberpunk</span>
      </div>
      <div className="px-4 py-2.5 rounded-xl bg-surface-container-highest/60 flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-landing-info"></span>
        <span className="font-label-md text-sm text-on-surface-variant">Aqua</span>
      </div>
      <div className="px-4 py-2.5 rounded-xl bg-surface-container-highest/60 flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full bg-landing-success"></span>
        <span className="font-label-md text-sm text-on-surface-variant">Forest</span>
      </div>
    </div>
  </div>
</section>

{/*  SECTION 6: FINAL FRICTIONLESS CALL-TO-ACTION & SECURITY  */}
<section className="w-full px-margin-mobile md:px-margin py-20 lg:py-28 relative overflow-hidden">
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-t from-landing-primary-container/20 via-landing-secondary/15 to-transparent blur-[120px] pointer-events-none rounded-t-full"></div>
  <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-12 relative z-10">
    {/* Gradient Neon Banner Headline */}
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-landing-secondary via-landing-primary-container to-landing-tertiary p-0.5 shadow-[0_0_32px_rgba(231,121,193,0.6)] flex items-center justify-center">
        <div className="w-full h-full bg-landing-base-100 rounded-[14px] flex items-center justify-center">
          <span className="material-symbols-outlined text-landing-primary text-[36px]">airwave</span>
        </div>
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-on-surface max-w-3xl leading-tight">
        Your Sky Has a Sound. <br />
        <span className="bg-gradient-to-r from-landing-secondary via-landing-primary to-landing-tertiary bg-clip-text text-transparent">
          Tune In Now.
        </span>
      </h2>
      <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
        Connect your Spotify account in one click. Experience playlists that evolve seamlessly as the clouds drift and the sun sets.
      </p>
    </div>

    {/* Action Button */}
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <button
        onClick={onConnectSpotify}
        className="inline-flex items-center gap-3 bg-[#1DB954] text-white px-9 py-4 rounded-full font-label-lg text-base shadow-[0_0_30px_rgba(29,185,84,0.65)] hover:shadow-[0_0_45px_rgba(29,185,84,0.95)] hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold tracking-wide"
      >
        <img
          alt="Spotify Icon"
          className="w-6 h-6 object-contain"
          src="/spotify_icons/Spotify_Icon_RGB_White.png"
        />
        <span>Launch with Spotify</span>
      </button>
    </div>

    {/* Spotify Web API Integration Note */}
    <div className="flex items-center gap-3 pt-2">
      <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Powered by</span>
      <img
        alt="Spotify White Logo"
        className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
        src="/spotify_logos/Spotify_Logo_RGB_White.png"
      />
    </div>

    {/* Security & PKCE Architecture Box */}
    <div className="w-full max-w-3xl bg-surface-container-low/80 backdrop-blur-md rounded-2xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left border border-white/5">
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-landing-secondary text-[22px] flex-shrink-0 mt-0.5">enhanced_encryption</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-xs text-on-surface font-bold">OAuth 2.0 PKCE</span>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Standard secure authorization</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-landing-primary text-[22px] flex-shrink-0 mt-0.5">key_off</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-xs text-on-surface font-bold">Zero Passwords</span>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Credentials never stored</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#1DB954] text-[22px] flex-shrink-0 mt-0.5">verified_user</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-xs text-on-surface font-bold">Direct Spotify API</span>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Standard Web API calls</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-landing-tertiary text-[22px] flex-shrink-0 mt-0.5">playlist_add</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-xs text-on-surface font-bold">Playlist Export</span>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Save mixes directly to account</span>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
      </main>
      <footer className="w-full bg-surface-container-lowest border-t border-white/5">
        <div className="w-full px-margin py-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-landing-base-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-landing-primary text-[20px]">airwave</span>
              </div>
              <span className="font-headline-sm text-xl font-bold text-on-surface">Weatherify</span>
              <span className="font-label-sm text-xs text-on-surface-variant">Soundtrack Generator</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-landing-secondary text-[16px]">lock</span>
                <span className="font-label-sm text-xs text-on-surface">OAuth 2.0 PKCE</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
                <span className="font-label-sm text-xs text-on-surface">OpenWeatherMap Live</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 bg-surface-container-low/40 rounded-xl px-6 py-4 border border-white/5">
            <p className="font-body-sm text-xs text-on-surface-variant text-center md:text-left">
              Powered by Spotify Web API &amp; OpenWeatherMap. Music metadata provided via Spotify.
            </p>
            <div className="flex items-center gap-6">
              <a className="font-label-sm text-xs text-on-surface-variant hover:text-landing-secondary transition-colors" href="#how-it-works">How It Works</a>
              <a className="font-label-sm text-xs text-on-surface-variant hover:text-landing-secondary transition-colors" href="#simulator">Live Simulator</a>
              <a className="font-label-sm text-xs text-on-surface-variant hover:text-landing-secondary transition-colors" href="#personalization">Personalization</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StitchLanding;

