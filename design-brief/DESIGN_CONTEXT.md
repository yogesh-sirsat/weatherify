# Weatherify - Design Context & Implementation Blueprint

## 1. Current Technology Stack & Architectural Patterns

- **Framework**: Next.js 14/15 App Router (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/signin/page.tsx`).
- **Language**: TypeScript (`.ts`, `.tsx`) with strict typing (`@/types/spotify.ts`, `@/types/weather.ts`).
- **CSS Architecture**: Tailwind CSS 3.3.3 + DaisyUI 3.9.2 component library.
- **Theme Switcher**: `theme-change` (2.5.0) managing `data-theme` attributes on the HTML root.
- **Iconography**:
  - Heroicons (`@heroicons/react`)
  - Custom SVG components (`AlertSvgs.tsx`, `ArrowPath.tsx`, `XMark.tsx`)
  - Official Spotify brand assets (`SpotifyIcon.tsx` referencing RGB PNGs).
- **Network / Client State**: Axios instances (`axiosSpotify` with Bearer auth, `axiosConfig` with base URL), cookie storage (`js-cookie`), and `localStorage` caching with TTL.

---

## 2. Existing Color System & Themes

Weatherify relies on DaisyUI's dynamic semantic color system, which adapts across 8 configured themes in `tailwind.config.js`:

```javascript
// tailwind.config.js themes
themes: [
  "light",
  "dark",
  "synthwave", // App default theme
  "retro",
  "cyberpunk",
  {
    valentine: {
      ...require("daisyui/src/theming/themes")["[data-theme=valentine]"],
      "accent": "#000080",
    }
  },
  "aqua",
  "forest"
]
```

### Semantic Color Variables Used Across UI
- **`primary`**: Main call-to-actions ("Get Recommendations", "Let's Create", "Submit", action buttons).
- **`accent`**: Headings, section titles, filter labels, and active radio buttons (`#000080` in Valentine, neon cyan/magenta in Synthwave/Cyberpunk).
- **`base-100`**: Primary card background, input field background.
- **`base-200`**: Sidebar background, container background, outer card panels.
- **`base-300`**: Borders, dropdown dividers.
- **`success`**: Playlist creation confirmations, "Create Playlist" button (`btn-success`).
- **`warning`**: Location permission alerts, playlist minimum track warnings.
- **`error`**: API error banners, delete track buttons (`hover:bg-error`).
- **Spotify Official Brand Color**: `#1DB954` (Spotify Green used in brand icons and direct link tags).

---

## 3. Typography & Spacing Hierarchy

### Typography Scale
- **Display / Hero**: `text-5xl md:text-9xl font-bold` (used on current `/signin` page).
- **Section Headers**: `text-3xl md:text-4xl font-semibold` (e.g. "Your Recent Top Artists").
- **Card Titles**: `text-xl md:text-2xl font-bold font-medium`.
- **Labels & Micro-copy**: `text-xs md:text-sm font-medium` (e.g. "LISTEN ON SPOTIFY", "PLAY ON SPOTIFY", time tags).
- **Font Stack**: Default system sans-serif / Inter via Tailwind's default sans stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).

### Spacing & Grid Conventions
- **Containers**: `container mx-auto px-4`, `p-2 md:p-4`, `gap-2 md:gap-4`.
- **Border Radii**: `rounded-2xl` for main cards, `rounded-full` for genre pills and avatars, `rounded-xl` for panels.
- **Elevation / Shadows**: `shadow-md`, `shadow-xl`, `drop-shadow-lg`.

---

## 4. Existing Components & Functional Units

### 1. `Navbar` (`src/components/Navbar.tsx`)
- Appears on mobile/tablet viewports (`xl:hidden`).
- Houses brand logo and animated hamburger/close toggle.

### 2. `SideNav` (`src/components/SideNav.tsx`)
- Persistent navigation panel on desktop (`hidden xl:flex w-64`).
- Displays user profile avatar (`user.image300` from Spotify), user display name linking to Spotify.
- Tabs: `Weather x Time` (active), `Mood x Activity` (placeholder), `You x Custom` (placeholder).
- Theme dropdown selector (`data-choose-theme`) + "Disconnect" account action.

### 3. `Weather` (`src/app/weather/Weather.tsx`)
- Geolocation auto-detection with error fallback.
- OpenWeatherMap integration displaying:
  - City name & country badge
  - Weather icon (`@4x.png` from OpenWeatherMap)
  - Weather main category (Clear Sky, Partly Clouds, Rain, Snow, etc.) and detailed description
  - Metric stats: Temperature, Feels Like, Humidity, Pressure
- Circadian Time Period pill + inspirational mood message (`head` and `body` such as *"Golden Hour: The golden hour brings a warm feeling"*).
- Manual location modal (`dialog.modal`) with live debounced city autocomplete.

### 4. `UsersTopArtists` (`src/app/users-top-artists/UsersTopArtists.tsx`)
- Fetches user's top Spotify artists via Spotify Web API.
- Grid of artist cards displaying 240x240 cover image, artist name, direct Spotify link, and a global popularity progress bar (`progress-secondary`).
- Fallback message prompting users without history to select genres.

### 5. `Genres` (`src/components/Genres.tsx`)
- 33 curated music genres rendered as interactive pill buttons.
- Multi-select logic with a hard limit of 5 genres (enforced by Spotify's seed limit).
- Active state: `btn-accent`; Inactive state: `btn-accent btn-outline`.

### 6. `Recommendations` (`src/components/Recommendations.tsx`)
- Slide-over drawer / modal (`fixed inset-0 translate-x-0`).
- Lists recommended tracks with album thumbnail (120x120), song title, artists, direct Spotify link, track popularity bar.
- Individual track removal button (`XMark`), enforcing a minimum of 2 tracks.
- Primary actions: Refresh recommendations (`ArrowPath`), and "Create Playlist" (`btn-success`).

### 7. `SpotifyIcon` (`src/components/SpotifyIcon.tsx`)
- Theme-aware Spotify logo rendering black, green, or white brand assets according to background lightness.

---

## 5. Components & Functionality That Must Be Preserved

1. **Authentication Flow**: Spotify OAuth 2.0 PKCE flow with secure cookie storage.
2. **Environmental Inputs**: Real OpenWeatherMap data (temp, feels like, humidity, conditions) + manual location search modal.
3. **Circadian Classification**: 11 diurnal buckets determining circadian audio parameters.
4. **Three-Way Priority Control**: "Weather", "Balanced", and "Time" algorithmic weighting.
5. **Genre Seeding Ceiling**: Maximum 5 seed genres/artists.
6. **Tracklist Drawer & Export**: Track previewing, deletion, and one-click export into user Spotify library.
7. **DaisyUI Theme Compatibility**: Styles must support dynamic theme changing without broken contrast or hardcoded unreadable text colors.

---

## 6. Key Project File Paths for Reference

| Role | Repository Path |
| :--- | :--- |
| **Main Page / Application Dashboard** | `src/app/page.tsx` |
| **Sign-In / Current Landing Experience** | `src/app/signin/page.tsx` |
| **Root Layout** | `src/app/layout.tsx` |
| **Global Styles** | `src/app/globals.css` |
| **Tailwind & DaisyUI Configuration** | `tailwind.config.js` |
| **Weather Component & Search Modal** | `src/app/weather/Weather.tsx` |
| **Recommendations Drawer** | `src/components/Recommendations.tsx` |
| **Top Artists Grid** | `src/app/users-top-artists/UsersTopArtists.tsx` |
| **Genre Pill Selector** | `src/components/Genres.tsx` |
| **Navigation & Header Components** | `src/components/Navbar.tsx`, `src/components/SideNav.tsx` |
| **Audio Feature Calculation Algorithm**| `src/utils/audioFeatures.ts` |
| **Spotify API Client & Tokens** | `src/utils/getAccessToken.ts`, `src/config/axiosConfig.ts` |
| **TypeScript Type Definitions** | `src/types/spotify.ts`, `src/types/weather.ts` |
