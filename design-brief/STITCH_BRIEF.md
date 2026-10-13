# Weatherify - Design Brief for Google Stitch

## 1. Executive Summary & Value Proposition
**Weatherify** is a mood-responsive music intelligence platform that connects live atmospheric conditions and human circadian rhythm with Spotify's audio analysis engine to curate hyper-contextual music playlists.

### Who It Serves
1. **Atmosphere Seekers & Flow-State Workers**: Listeners who want their soundtrack to seamlessly echo the outdoor weather (rainy lo-fi, sunny high-tempo synthpop, stormy dynamic rock) without manual playlist curation.
2. **Music Enthusiasts & Spotify Superusers**: Users who crave novel ways to rediscover their own taste by letting real-world biometric/environmental signals (circadian phase, weather phenomena) reshape their listening queue.
3. **Daily Routine Curators**: Listeners wanting effortless morning wake-up tracks, focused afternoon drives, golden hour chill-out vibes, or midnight stillness playlists.

---

## 2. Core Functional Architecture & Real User Workflows

### Primary User Workflow
1. **Entry & Authentication**:
   - Unauthenticated visitors land on the landing/welcome experience (`/signin` or homepage).
   - Authenticates via Spotify OAuth 2.0 PKCE flow (`playlist-modify-private`, `playlist-modify-public`, `user-read-recently-played`, `user-top-read`).
2. **Environmental & Biometric Signal Ingestion**:
   - **Geolocation & Weather**: Browser Geolocation API resolves latitude/longitude to OpenWeatherMap 2.5 Current Weather (temperature, feels-like, humidity, pressure, description, weather group).
   - **Manual Location Fallback**: Debounced OpenWeatherMap Geocoding search allows searching cities globally with auto-suggestions.
   - **Circadian Cycle Determination**: Computes local time zone offset to determine one of 11 distinct Circadian Time Periods (e.g., *Early Morning*, *Midday*, *Golden Hour*, *Late Night*).
3. **Taste & Bias Configuration (User Controls)**:
   - **Priority Bias Switch**: Allows users to balance whether playlist sound features favor "Weather" (weight 2.2x), "Time" (weight 2.2x), or "Balanced" (1.5x each + harmonic key blend).
   - **Genre Seeding**: Optional multi-tag selection (up to 5 genres from 33 curated tags like *chill, indie, jazz, ambient, trip-hop, electronic*).
   - **Listening Taste Fallback**: If no genres are selected, Weatherify dynamically seeds recommendations with the user's top Spotify artists (`usersTopArtists`).
4. **Algorithmic Audio Feature Calculation**:
   - Blends 8 audio features:
     - `valence` (musical positiveness: 0.0 – 1.0)
     - `energy` (intensity and activity: 0.0 – 1.0)
     - `tempo` (BPM: 70 – 155 BPM)
     - `danceability` (rhythmic regularity: 0.0 – 1.0)
     - `acousticness` (organic vs synthetic: 0.0 – 1.0)
     - `instrumentalness` (vocal absence: 0.0 – 1.0)
     - `key` (pitch class: 0 to 11)
     - `mode` (Major = 1, Minor = 0)
5. **Recommendation & Playlist Generation**:
   - Queries Spotify Recommendation API with target audio parameters.
   - Opens a sliding interactive queue panel showing 20 curated tracks with album art, artist names, popularity indicators, and direct Spotify playback links.
   - User can prune tracks (delete individual songs; minimum 2 required).
   - One-click "Create Playlist" publishes directly into user's Spotify account library.

---

## 3. Real Data Sources & Architectural Constraints

| Dimension | Real Implementation Details | Constraint / Rule |
| :--- | :--- | :--- |
| **Weather Engine** | OpenWeatherMap API (`/data/2.5/weather` + `/geo/1.0/direct`) | Cached in client cookies with 10-minute TTL. Returns metric units (°C, hPa, %). |
| **Circadian Engine** | Timezone offset UTC calculations | Partitioned into 11 diurnal buckets (Dawn's Delight, Energizing Start, Golden Hour, Twilight Tranquility, Midnight Stillness, etc.). |
| **Music Data Engine**| Spotify Web API (`v1/me`, `v1/me/top/artists`, `v1/recommendations`, `v1/me/playlists`) | Maximum 5 seed targets total (Spotify API hard ceiling: seeds split between genres or artists). |
| **Playlist Size** | 20 tracks default; user can delete tracks down to 2 tracks | Track deletion updates queue size live. |
| **Theme Engine** | DaisyUI + `theme-change` plugin | 8 runtime themes: `synthwave` (default), `light`, `dark`, `retro`, `cyberpunk`, `valentine`, `aqua`, `forest`. |
| **Authentication** | Spotify OAuth 2.0 PKCE | Session stored via secure cookies (`access_token`, `refresh_token`, `user_id`). |

---

## 4. Suggested Homepage Sections Based on Real Functionality

To deliver a high-converting, immersive landing experience without inventing fake features, Stitch should structure the page around these verified capabilities:

### Section 1: Hero — Atmospheric Soundscape Portal
- **Headline**: *Your Soundtrack, Tuned by the Sky and the Hour.*
- **Sub-copy**: Real-time atmospheric conditions and circadian rhythms meet Spotify's audio analysis to generate music attuned to your moment.
- **Interactive Call-to-Action**: "Connect with Spotify" / "Launch Weatherify" with instant preview demo.
- **Dynamic Live Micro-Widget**: A live teaser displaying a mock or real "Weather Vibe Badge" (e.g. *Rain x Twilight Tranquility &bull; Valence: 0.35 &bull; 86 BPM &bull; Neo-Soul & Lo-Fi*).

### Section 2: The Tri-Factor Formula (How Weatherify Works)
Visual interactive breakdown of the 3 signals driving recommendations:
1. **Atmosphere (Weather)**: Real-time weather states (Clear Sky, Rain, Thunderstorm, Fog/Haze, Snow) shaping acousticness, valence, and tempo.
2. **Circadian Rhythm (Time of Day)**: 11 diurnal intervals tuning human energy curves from dawn awakenings to midnight solitude.
3. **Personal Taste (Spotify Listening History)**: Pulls user's top artists or allows custom genre tag seeds (up to 5 genres).

### Section 3: Live "Vibe Previewer" / Audio Trait Spectrum
Showcases how real audio parameters morph based on weather and time:
- Interactive toggle between conditions (e.g. "Sunny Midday" vs "Rainy Midnight" vs "Stormy Evening").
- Visual spectrum bars displaying real calculated audio traits:
  - *Sunny Midday*: Valence 82% &bull; Energy 78% &bull; Tempo 125 BPM (Bright Pop, Dance)
  - *Rainy Twilight*: Valence 35% &bull; Energy 36% &bull; Tempo 86 BPM (Acoustic, Lo-Fi, Neo-Soul)
  - *Thunderstorm*: Energy 88% &bull; Tempo 138 BPM &bull; Mode: Minor (Driving Rock, Electronic)

### Section 4: Deep Personalization & Bias Controls
Spotlight on the unique controls available in the app:
- **Priority Bias Switch**: Weather-focused vs. Time-focused vs. Harmonic Balanced.
- **Genre Pill Selector**: 33 verified genres with live multi-tag toggle.
- **Editable Recommendation Drawer**: Prune songs, preview on Spotify, and export seamlessly into user libraries.

### Section 5: Theming & Atmosphere Showcase
- Showcase Weatherify's aesthetic versatility (demonstrating how the interface transforms across Synthwave neon, Cyberpunk, Forest, Aqua, Retro, and Clean Dark themes).

### Section 6: Frictionless Call-to-Action & Security
- "Create Your First Weather Playlist in 10 Seconds".
- Privacy assurance: Official Spotify PKCE authorization, zero password storage, read/write playlist permissions only.

---

## 5. Three Distinct Visual Design Directions to Explore

### Direction A: "Atmospheric Glassmorphism & Aurora Ambient" (Modern Premium)
- **Concept**: Deep atmospheric obsidian backdrops with organic, fluid aurora blurs matching current sky conditions (e.g. misty cyan/violet for rain, warm amber/peach for golden hour, electric indigo for thunderstorms).
- **Styling**: Frosted glass containers (`backdrop-blur-xl`, subtle 1px border glows `rgba(255,255,255,0.08)`), glowing typography, high-definition meteorological icons.
- **Tone**: Sophisticated, immersive, high-end streaming service aesthetic (reminiscent of Apple Music / Raycast / Linear).
- **Target Audience**: Design-conscious users who love sleek, polished dark interfaces.

### Direction B: "Retro-Futuristic Synthwave & Neon Cyber-Grid" (Weatherify's Brand Signature)
- **Concept**: Leans directly into Weatherify's default `synthwave` and `cyberpunk` DaisyUI roots. Neon magenta, electric violet, cyan gradients, subtle scanlines or isometric perspective grids.
- **Styling**: Glowing pill tags, vibrant dual-tone album sleeves, bold display typography, audio equalizer pulse animations, high-contrast badges.
- **Tone**: Playful, nostalgic, energetic, and distinct from sterile corporate weather widgets.
- **Target Audience**: Gamers, music producers, and nightlife / electronic music fans.

### Direction C: "Editorial Sonic Journal & Organic Circadian" (Warm Analog)
- **Concept**: A tactile, vinyl-and-weather almanac aesthetic. Focuses on natural human rhythms, paper-like warmth, rich typography, and minimal ambient color washes.
- **Styling**: Large editorial serif headers paired with clean technical monospace data labels (BPM, Key, Weather Coordinates). Warm cream, deep slate, moss green, and terracotta accents.
- **Tone**: Thoughtful, mindful, cozy, and poetic. Celebrates listening as a conscious daily ritual.
- **Target Audience**: Indie music fans, acoustic/lo-fi listeners, and productivity/mindfulness practitioners.

---

## 6. Important Interactions & Responsive Requirements

1. **Responsive Layout Hierarchy**:
   - **Desktop (1024px+)**: Split-screen hero with interactive dynamic vibe card, horizontal comparison sliders, and side drawer preview.
   - **Tablet / Mobile (375px – 768px)**: Single-column stacked narrative, sticky bottom "Connect / Launch" floating bar, swipeable genre chips, touch-friendly audio feature bars.
2. **Interactive Micro-Moments**:
   - Condition morpher: Clicking different weather tags smoothly shifts the hero gradient and audio feature meters.
   - Spotify Track Row hover: Card expands slightly with Spotify green play icon and animated equalizer bars.
   - Genre selection: Multi-select pill toggle with spring animation and maximum 5-tag counter badge.
3. **Accessibility & Usability**:
   - High contrast text across dynamic weather backgrounds.
   - WCAG AA compliant contrast for all interactive buttons and badges.
   - No generic weather-app clutter (no 7-day barometric pressure forecasts or wind radar maps—keep the focus strictly on **weather as a musical mood catalyst**).
