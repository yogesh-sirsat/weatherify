import Image from "next/image";
import { useState, useEffect } from "react";

export default function SpotifyIcon({ theme, width, height }) {
  const [iconSrc, setIconSrc] = useState(
    "/spotify_icons/Spotify_Icon_RGB_Green.png"
  );

  useEffect(() => {
    switch (theme) {
      case "forest":
      case "dark":
        setIconSrc("/spotify_icons/Spotify_Icon_RGB_Green.png");
        break;
      case "synthwave":
      case "aqua":
        setIconSrc("/spotify_icons/Spotify_Icon_RGB_White.png");
        break;
      case "light":
      case "retro":
      case "cyberpunk":
      case "valentine":
        setIconSrc("/spotify_icons/Spotify_Icon_RGB_Black.png");
        break;
      default:
        setIconSrc("/spotify_icons/Spotify_Icon_RGB_Green.png");
    }
  }, [theme]);

  return (
    <Image
      src={iconSrc}
      alt="Spotify Icon"
      width={width || 16}
      height={height || 16}
    />
  );
}
