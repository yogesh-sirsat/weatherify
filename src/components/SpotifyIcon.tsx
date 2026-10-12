import React, { useState, useEffect, FC } from "react";
import Image from "next/image";

interface SpotifyIconProps {
  theme?: string;
  width?: number;
  height?: number;
}

const SpotifyIcon: FC<SpotifyIconProps> = ({ theme, width = 16, height = 16 }) => {
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
      width={width}
      height={height}
    />
  );
};

export default SpotifyIcon;
