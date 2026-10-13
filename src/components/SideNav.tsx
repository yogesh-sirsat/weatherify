import React, { FC, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { UserProfile } from "@/types/spotify";

interface SideNavProps {
  setTheme: (theme: string) => void;
  theme: string;
  user: UserProfile;
  isHamburger: boolean;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const themes = [
  { value: "synthwave", label: "Synthwave", description: "Neon and expressive" },
  { value: "light", label: "Light", description: "Bright and clean" },
  { value: "dark", label: "Dark", description: "Low-light friendly" },
  { value: "retro", label: "Retro", description: "Warm and nostalgic" },
  { value: "cyberpunk", label: "Cyberpunk", description: "High-contrast neon" },
  { value: "valentine", label: "Valentine", description: "Soft and playful" },
  { value: "aqua", label: "Aqua", description: "Cool and spacious" },
  { value: "forest", label: "Forest", description: "Natural and calm" },
];

const PaletteIcon: FC = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 0 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.8 1.8 0 0 1 1.3-3.1H18a3 3 0 0 0 3-3A8.5 8.5 0 0 0 12 3Z" />
    <circle cx="7.5" cy="10" r=".8" fill="currentColor" /><circle cx="10" cy="6.8" r=".8" fill="currentColor" /><circle cx="14" cy="6.8" r=".8" fill="currentColor" /><circle cx="17" cy="10" r=".8" fill="currentColor" />
  </svg>
);

const SideNav: FC<SideNavProps> = ({
  setTheme,
  theme,
  user,
  isHamburger,
  selectedTab,
  setSelectedTab,
}) => {
  const themeMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeThemeMenu = (event: PointerEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        themeMenuRef.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeThemeMenu);
    return () => document.removeEventListener("pointerdown", closeThemeMenu);
  }, []);

  const handleDisconnect = () => {
    Cookies.remove("user_id");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/signin";
  };

  return (
    <aside
      className={`${
        isHamburger ? "hidden xl:flex" : "flex"
      } top-0 flex-col w-64 fixed xl:sticky min-h-full h-screen self-start overflow-visible px-4 py-8 bg-base-200 z-10 shadow-xl duration-500 ease-in-out`}
    >
      <h1 className="btn btn-ghost mx-auto text-2xl normal-case flex items-center">
        Weatherify
      </h1>

      <div className="flex flex-col items-center p-4 avatar">
        <div className="w-24 rounded-full">
            <Image
              src={user.image300 ? user.image300 : "https://picsum.photos/64"}
              alt="profile picture"
              width={160}
              height={160}
            />
        </div>
        <h2 className="btn btn-ghost mt-2 text-lg normal-case">
          <a href={user.spotify} target="_blank" rel="noreferrer noopener">
            {user.name}
          </a>
        </h2>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col justify-between">
        <nav>
          <ul className="menu bg-base-100 w-full gap-1 rounded-box">
            <li>
              <a
                className={selectedTab === "weather x time" ? "active" : ""}
                onClick={() => setSelectedTab("weather x time")}
              >
                Weather x Time
              </a>
            </li>
            <li>
              <a
                className={selectedTab === "mood x activity" ? "active" : ""}
                onClick={() => setSelectedTab("mood x activity")}
              >
                Mood x Activity
              </a>
            </li>
            <li>
              <a
                className={selectedTab === "user x custom" ? "active" : ""}
                onClick={() => setSelectedTab("user x custom")}
              >
                User x Custom
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="divider"></div>
      <footer>
        <ul className="menu bg-base-100 flex flex-col gap-2 rounded-box w-full">
          <details ref={themeMenuRef} className="dropdown dropdown-top dropdown-end relative z-[100] w-full">
            <summary className="btn btn-ghost flex w-full justify-between normal-case">
              <span className="flex items-center gap-2"><PaletteIcon /><span>Theme</span></span>
              <span className="badge badge-ghost max-w-28 truncate">{themes.find((option) => option.value === theme)?.label || "Choose"}</span>
            </summary>
            <ul tabIndex={0} className="dropdown-content menu right-2 z-[100] mb-2 w-56 max-w-[calc(100vw-1rem)] rounded-box border border-base-300 bg-base-100 p-2 shadow-2xl">
              <li className="menu-title px-3 pb-1 pt-2">Color theme</li>
              {themes.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    data-set-theme={option.value}
                    data-act-class="active"
                    className={theme === option.value ? "active" : ""}
                    onClick={() => {
                      setTheme(option.value);
                      if (themeMenuRef.current) themeMenuRef.current.open = false;
                    }}
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span data-theme={option.value} className="flex shrink-0 gap-0.5 rounded bg-base-200 p-0.5" aria-hidden="true"><span className="h-3 w-3 rounded-full bg-primary" /><span className="h-3 w-3 rounded-full bg-secondary" /><span className="h-3 w-3 rounded-full bg-accent" /></span>
                      <span className="min-w-0"><span className="block truncate">{option.label}</span><span className="block text-xs font-normal opacity-60">{option.description}</span></span>
                    </span>
                    {theme === option.value && <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg>}
                  </button>
                </li>
              ))}
            </ul>
          </details>
          <li>
            <a className="hover:bg-error" onClick={handleDisconnect}>
              Disconnect
            </a>
          </li>
        </ul>
      </footer>
    </aside>
  );
};
export default SideNav;
