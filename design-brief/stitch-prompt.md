# Google Stitch Master Prompt: Weatherify Homepage Redesign

Copy and paste the exact prompt below into **Google Stitch** (along with the provided context files and reference assets) to generate high-fidelity, production-aligned homepage designs for Weatherify.

```markdown
You are an elite principal product and UI/UX designer redesigning the homepage landing page for **Weatherify**.

Weatherify is a live music intelligence application that connects real-time weather conditions and human circadian rhythm with Spotify's audio analysis engine to curate personalized playlists.

### CRITICAL INSTRUCTIONS: WHAT TO AVOID
- DO NOT create a generic weather dashboard with 7-day weather forecasts, wind speed radars, air quality indices, or meteorological charts. Weatherify is NOT a weather report utility.
- DO NOT invent nonexistent features (such as social friend feeds, paid tier paywalls, podcasts, or music uploads).
- Weather is strictly used as an emotional and musical catalyst that shapes sound parameters (valence, energy, tempo, danceability, acousticness, key).

---

### PRODUCT CONTEXT & REAL FEATURES
1. **Real-time Environmental Intelligence**:
   - Ingests user geolocation and retrieves live condition data from OpenWeatherMap (e.g., Clear Sky, Partly Clouds, Rain, Thunderstorm, Snow, Mist/Haze) + local temperature and time.
   - Fallback to instant city search with auto-complete suggestions.
2. **Circadian Rhythm Engine**:
   - Maps the hour into 11 circadian periods (e.g., Early Morning, Energizing Start, Midday, Golden Hour, Twilight Tranquility, Midnight Stillness) that reflect human energy cycles.
3. **Audio Feature Calculation**:
   - Algorithmic blending of 8 musical traits: Valence (mood), Energy, Tempo (BPM), Danceability, Acousticness, Instrumentalness, Key, and Mode.
   - User Priority Toggle allows balancing recommendations toward "Weather" (2.2x weight), "Time" (2.2x weight), or "Balanced" (harmonic key blend).
4. **Spotify Personalization & Export**:
   - Seeds tracks using the user's top Spotify artists or up to 5 custom-selected genres (from 33 curated tags like chill, indie, jazz, ambient, trip-hop, electronic).
   - Generates 20 recommended tracks in a slide-out queue with album art, popularity meters, track deletion capability, and one-click export into the user's Spotify library.

---

### YOUR DESIGN TASK: EXPLORE THREE DISTINCT VISUAL DIRECTIONS
Create high-fidelity landing page concepts for Weatherify that wow users at first glance, clearly communicate the value proposition, and provide interactive entry into the app. Please present three distinct aesthetic directions:

#### Direction 1: "Atmospheric Glassmorphism & Aurora Ambient" (Modern Premium)
- Deep obsidian backdrop with dynamic aurora ambient gradients responsive to the current sky (e.g. moody violet/cyan for rain, amber/coral for golden hour).
- Frosted glass containers (`backdrop-blur-xl`, subtle 1px border glows), refined typography, glowing data tags, and high-end streaming service elegance (inspired by Apple Music / Linear).

#### Direction 2: "Retro-Futuristic Synthwave & Neon Cyber-Grid" (Weatherify's Brand Signature)
- Leaning into Weatherify's core synthwave DNA: neon magenta, electric cyan, deep indigo, subtle retro grids, glowing pill badges, and audio visualizer pulse accents.
- Energetic, punchy, nostalgic yet modern—positioning Weatherify as a distinctive, playful audio experience.

#### Direction 3: "Editorial Sonic Journal & Organic Circadian" (Warm Analog)
- Tactile vinyl-and-weather almanac aesthetic: warm cream/slate palette, editorial serif typography paired with crisp monospace music data labels (BPM, Key, Weather Coordinates).
- Celebrates mindful daily listening rituals, organic acoustic warmth, and circadian balance.

---

### SUGGESTED PAGE STRUCTURE & CONTENT FLOW
1. **Hero Section**:
   - Punchy headline: *"Your Soundtrack, Tuned by the Sky and the Hour."*
   - Clear value proposition: Connecting live atmospheric conditions with Spotify audio intelligence.
   - Primary CTA: *"Connect with Spotify"* / *"Launch Weatherify"* with Spotify brand badge.
   - Live interactive "Vibe Badge" widget showing current live weather x circadian period (e.g., "Rain x Twilight Tranquility • 86 BPM • Valence 35% • Neo-Soul & Lo-Fi").
2. **The Tri-Factor Formula (How It Works)**:
   - 3 clean visual pillars: 01 Sky (Weather Condition) + 02 Rhythm (Circadian Phase) + 03 Taste (Spotify History or Selected Genres).
3. **Interactive Audio Trait Spectrum / Live Vibe Simulator**:
   - Interactive preview toggling between different weather moods (e.g., Sunny Afternoon vs Rainy Midnight vs Stormy Dusk) showing how Valence, Energy, and Tempo dynamic sliders shift.
4. **Deep Personalization & Control Showcase**:
   - Showcase the 3-way Priority Switch (Weather vs Balanced vs Time) and the 33-genre selector pills.
   - Interactive preview of the editable 20-track recommendation drawer with one-click Spotify export.
5. **Theme Versatility**:
   - Highlight the dynamic theme-switching capability (Synthwave, Cyberpunk, Aqua, Forest, Retro, Dark).
6. **Footer & Trust**:
   - Spotify API integration notice, privacy assurance (PKCE direct login, zero credential storage), and GitHub / project credits.

---

### IMPLEMENTATION & STYLING SPECIFICATIONS
- **Target Tech**: Next.js App Router, Tailwind CSS, DaisyUI semantic tokens (`primary`, `accent`, `base-100`, `base-200`, `success`, `warning`).
- **Brand Standards**: Keep official Spotify green (`#1DB954`) and authentic Spotify marks for all streaming actions.
- Ensure the designs are fully responsive (desktop split view + mobile touch-friendly sticky action).
```
