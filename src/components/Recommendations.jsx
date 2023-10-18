import { useState } from "react";
import Image from "next/image";
import ArrowPath from "./svgs/ArrowPath";
import XMark from "./svgs/XMark";
import Alert from "./Alert";
import manageAlerts from "@/utils/manageAlerts";
import LoadingScreen from "./LoadingScreen";
import LoadingSkeleton from "./LoadingSkeleton";

function Recommendations({
  isRecommendations,
  setIsRecommendations,
  recommendations,
  setRecommendations,
  fetchRecommendations,
  createPlaylist,
  isProcessing,
}) {
  const [warning, setWarning] = useState(null);

  const removeFromRecommendations = (id) => {
    if (recommendations.length === 2) {
      manageAlerts(setWarning, "Playlists need at least 2 tracks!");
      return;
    }
    setRecommendations((prev) => prev.filter((track) => track.id !== id));
  };

  return (
    <main
      className={
        " fixed overflow-hidden z-10 bg-neutral bg-opacity-30 inset-0 transform ease-in-out " +
        (isRecommendations
          ? " transition-opacity opacity-100 duration-500 translate-x-0"
          : " transition-all delay-500 opacity-0 translate-x-full")
      }
    >
      <section
        className={
          "w-screen bg-base-200 max-w-lg right-0 absolute h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isRecommendations ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen max-w-lg pb-12 flex flex-col overflow-y-scroll h-full">
          {warning ? (
            <Alert
              type="warning"
              message={warning}
              relativeClasses="bg-warning alert-warning fixed mx-8 mt-20 inset-x-0"
            />
          ) : null}
          <header className="sticky backdrop-blur-md bg-base-200 bg-opacity-50 top-0 p-4 flex flex-row gap-2 z-30">
            <button
              className="btn btn-ghost"
              onClick={() => setIsRecommendations(false)}
            >
              <svg
                type="button"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-bold self-center">
              New Recommendations For You!
            </h1>
          </header>
          {isProcessing ? (
            <ul>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </ul>
          ) : (
            <ul>
              {recommendations.map((track) => (
                <li
                  className="relative flex flex-col p-4 m-3 bg-base-100 rounded-2xl"
                  key={track.id}
                >
                  <button
                    className="btn btn-ghost btn-sm mr-1 mt-1 mb-4 ml-4 p-1.5 hover:bg-error absolute z-10 top-0 right-0"
                    onClick={() => removeFromRecommendations(track.id)}
                  >
                    <XMark />
                  </button>
                  <div className="flex flex-row gap-2 hover:bg-opacity-60">
                    <Image
                      className="rounded-sm"
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      width={120}
                      height={120}
                    ></Image>
                    <div className="relative flex flex-col p-2 w-full">
                      <h2 className="text-medium break-words">{track.name}</h2>
                      <h4 className="text-xs break-words">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </h4>
                      <a
                        className="flex flex-row gap-1 absolute bottom-0 pb-2"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={track.external_urls.spotify}
                      >
                        <Image
                          width={16}
                          height={16}
                          src="/spotify_icons/Spotify_Icon_RGB_Green.png"
                          alt="spotify_logo"
                        ></Image>
                        <p className="text-xs">PLAY ON SPOTIFY</p>
                      </a>
                    </div>
                  </div>
                  <div
                    className="tooltip tooltip-secondary"
                    data-tip="Recent Track Popularity"
                  >
                    <progress
                      className="progress progress-secondary"
                      value={track.popularity}
                      max="100"
                    ></progress>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <footer className="fixed bottom-0 flex flex-row justify-center gap-2 inset-x-0 p-4 w-full z-20">
            <button
              className="btn btn-primary btn-sm"
              onClick={fetchRecommendations}
            >
              <ArrowPath />
            </button>
            <div
              className="tooltip tooltip-success"
              data-tip="Creates new playlist in Spotify!"
            >
              <button className="btn btn-success btn-sm" onClick={createPlaylist}>
                Create Playlist - {recommendations.length}
              </button>
            </div>
          </footer>
        </article>
      </section>
      <section className="w-screen h-full"></section>
    </main>
  );
};

export default Recommendations;
