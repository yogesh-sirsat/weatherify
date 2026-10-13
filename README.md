# Weatherify

Weatherify creates Spotify recommendation playlists from the signals around you. It combines live weather, time of day, listening taste, moods, activities, genres, and Spotify audio-feature targets into playlists that can be reviewed and exported to Spotify.

## Features

### Weather x Time

- Reads current weather and local time from the weather view.
- Balances weather and time, or gives one signal more influence.
- Supports up to five Spotify genre seeds.
- Uses recent top artists when no genres or new-music discovery mode is selected.
- Lets you choose the number of tracks to generate, from 5 to 100.

### Mood x Activity

- Choose a mood, an activity, or combine both.
- Available moods include Happy, Calm, Focused, Melancholy, Confident, and Romantic.
- Available activities include Workout, Study, Commute, Cooking, Party, and Sleep & unwind.
- Choose whether mood, activity, or a balanced blend has more influence.
- Supports genre seeds, new-music discovery, and track-count controls.

### User x Custom

- Adjust Spotify recommendation targets with sliders.
- Controls include danceability, energy, valence, acousticness, instrumentalness, liveness, speechiness, tempo, loudness, popularity, duration, time signature, key, and mode.
- Normalized Spotify values are presented as percentages where appropriate.
- Import and customize Balanced, Weather, Time, Mood, and Activity presets.
- Any edited preset is labeled Custom for the current session.
- Each parameter has an information button with plain-language guidance.

### Recommendation review

- Preview available track clips with one shared player.
- Only one preview can play at a time.
- Preview playback stops when the recommendation drawer closes or its list changes.
- Remove tracks before creating the playlist.
- Refresh recommendations or add a chosen number of tracks with a maximum list size of 100.
- Open track links with `Play on Spotify` attribution.

### Playlist creation and themes

- Configure playlist name, description, cover image, and visibility before creation.
- Export the reviewed track list to the user's Spotify account.
- Choose from eight DaisyUI themes using the theme menu.
- Theme previews and application UI use theme-aware DaisyUI color tokens.
- The Recent Top Artists card strip is horizontally scrollable on small screens without moving its heading.

## How to use

1. Sign in with Spotify.
2. Allow location access or search for a city to load weather and local time.
3. Choose Weather x Time, Mood x Activity, or User x Custom.
4. Select genres, presets, audio targets, and the number of tracks as needed.
5. Generate recommendations and review the drawer.
6. Preview available clips, remove unwanted tracks, refresh, or add more tracks.
7. Create the playlist and customize its Spotify settings in the modal.

When genres are selected, Spotify receives genre seeds instead of recent top-artist seeds. This can broaden discovery, but Spotify does not guarantee that every result will be unfamiliar. The new-music option uses genre seeds when no genres are selected.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Useful checks:

```bash
npx tsc --noEmit
npm run build
```

## Technology

Next.js, React, TypeScript, Spotify Web API, OpenWeatherMap, Tailwind CSS, DaisyUI, MongoDB, Docker, AWS EC2/ECR, and Nginx.

## Screenshots

[Screenshots](https://1drv.ms/f/s!AljPuC-a7vuNqgoBUHdOIqGvCTNM?e=yxprZO)
