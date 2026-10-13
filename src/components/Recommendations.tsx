import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowPath from "./svgs/ArrowPath";
import XMark from "./svgs/XMark";
import Alert from "./Alert";
import manageAlerts from "@/utils/manageAlerts";
import LoadingSkeleton from "./LoadingSkeleton";
import SpotifyIcon from "./SpotifyIcon";
import { PlaylistSettings, SpotifyTrack } from "@/types/spotify";

interface RecommendationsProps {
  isRecommendations: boolean;
  setIsRecommendations: React.Dispatch<React.SetStateAction<boolean>>;
  recommendations: SpotifyTrack[];
  setRecommendations: React.Dispatch<React.SetStateAction<SpotifyTrack[]>>;
  onRemoveTrack: (id: string) => void;
  refreshRecommendations: () => void | Promise<void>;
  addMoreTracks: (count: number) => void | Promise<void>;
  createPlaylist: (settings: PlaylistSettings) => void | Promise<void>;
  isProcessing: boolean;
  theme: string;
  playlistSettings: PlaylistSettings;
}

const PreviewIcon: FC<{ isPlaying: boolean }> = ({ isPlaying }) => isPlaying ? (
  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
) : (
  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13L19 12 8 5.5z" /></svg>
);

const TrackPreview: FC<{ track: SpotifyTrack; isPlaying: boolean; onToggle: () => void }> = ({ track, isPlaying, onToggle }) => {
  if (!track.preview_url) return <span className="text-xs opacity-60">Preview unavailable</span>;
  return (
    <button className="btn btn-ghost btn-xs btn-square tooltip" data-tip="Preview" aria-label={isPlaying ? "Pause preview" : "Preview"} onClick={onToggle} type="button">
      <PreviewIcon isPlaying={isPlaying} />
    </button>
  );
};

const PlaylistSettingsModal: FC<{
  settings: PlaylistSettings;
  onClose: () => void;
  onCreate: (settings: PlaylistSettings) => void;
}> = ({ settings, onClose, onCreate }) => {
  const [draft, setDraft] = useState<PlaylistSettings>(settings);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const chooseCover = (file: File | null) => {
    setDraft((current) => ({ ...current, coverFile: file }));
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/60 p-4" role="dialog" aria-modal="true" aria-labelledby="playlist-settings-title">
      <form
        className="w-full max-w-lg rounded-2xl bg-base-100 p-5 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(draft);
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="playlist-settings-title" className="text-xl font-bold">Playlist settings</h2>
          <button className="btn btn-circle btn-ghost btn-sm" type="button" onClick={onClose} aria-label="Close playlist settings">
            <XMark />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Name</span>
            <input className="input input-bordered" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Description</span>
            <textarea className="textarea textarea-bordered" rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-semibold">Cover image</span>
            <input className="file-input file-input-bordered w-full" type="file" accept="image/jpeg,image/png" onChange={(event) => chooseCover(event.target.files?.[0] || null)} />
            {coverPreview && <Image className="mt-2 h-24 w-24 rounded object-cover" src={coverPreview} alt="Selected playlist cover" width={96} height={96} unoptimized />}
            <span className="label-text-alt mt-1 opacity-70">Spotify accepts JPEG or PNG cover art.</span>
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-base-300 p-3">
            <span><span className="block font-semibold">Visibility</span><span className="text-xs opacity-70">Make this playlist public on Spotify</span></span>
            <input className="toggle toggle-success" type="checkbox" checked={draft.isPublic} onChange={(event) => setDraft({ ...draft, isPublic: event.target.checked })} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" type="submit">Create playlist</button>
        </div>
      </form>
    </div>
  );
};

const Recommendations: FC<RecommendationsProps> = ({
  isRecommendations,
  setIsRecommendations,
  recommendations,
  setRecommendations,
  onRemoveTrack,
  refreshRecommendations,
  addMoreTracks,
  createPlaylist,
  isProcessing,
  theme,
  playlistSettings,
}) => {
  const [warning, setWarning] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMoreOpen, setIsAddMoreOpen] = useState(false);
  const [additionalTrackCount, setAdditionalTrackCount] = useState(20);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const stop = () => setActivePreviewId(null);
    audio.addEventListener("ended", stop);
    return () => audio.removeEventListener("ended", stop);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!isRecommendations || !recommendations.some((track) => track.id === activePreviewId)) {
      audio?.pause();
      if (audio) audio.currentTime = 0;
      setActivePreviewId(null);
    }
  }, [isRecommendations, recommendations, activePreviewId]);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setActivePreviewId(null);
  }, [recommendations]);

  const togglePreview = async (track: SpotifyTrack) => {
    const audio = audioRef.current;
    if (!audio || !track.preview_url) return;
    if (activePreviewId === track.id) {
      audio.pause();
      audio.currentTime = 0;
      setActivePreviewId(null);
      return;
    }
    audio.pause();
    audio.src = track.preview_url;
    audio.currentTime = 0;
    try {
      await audio.play();
      setActivePreviewId(track.id);
    } catch {
      setActivePreviewId(null);
    }
  };

  const removeFromRecommendations = (id: string) => {
    if (recommendations.length === 2) {
      manageAlerts(setWarning, "Playlists need at least 2 tracks!");
      return;
    }
    onRemoveTrack(id);
  };

  const maxAdditionalTracks = Math.max(0, 100 - recommendations.length);
  const openAddMore = () => {
    setAdditionalTrackCount(Math.min(20, maxAdditionalTracks));
    setIsAddMoreOpen(true);
  };

  return (
    <main className={"fixed overflow-hidden z-20 bg-base-content/30 inset-0 transform ease-in-out " + (isRecommendations ? "transition-opacity opacity-100 duration-500 translate-x-0" : "transition-all delay-500 opacity-0 translate-x-full")}>
      <section className={"fixed top-0 bottom-0 right-0 w-screen bg-base-200 max-w-lg shadow-xl delay-400 duration-500 ease-in-out transition-all transform " + (isRecommendations ? "translate-x-0" : "translate-x-full")}>
        <article className="w-screen max-w-lg pb-28 flex flex-col overflow-y-auto h-full">
          {warning && <Alert type="warning" message={warning} relativeClasses="bg-warning alert-warning fixed mx-8 mt-20 inset-x-0" />}
          <header className="sticky top-0 backdrop-blur-md bg-base-200 bg-opacity-50 p-1 md:p-2 flex flex-row gap-2 z-30">
            <button className="btn btn-ghost" onClick={() => setIsRecommendations(false)} aria-label="Close recommendations">
              <span aria-hidden="true" className="text-2xl">&larr;</span>
            </button>
            <h1 className="text-lg md:text-2xl font-bold self-center">New Recommendations For You!</h1>
          </header>
          {isProcessing && recommendations.length === 0 ? (
            <ul><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /></ul>
          ) : (
            <ul>
              {recommendations.map((track) => (
                <li className="relative flex flex-col p-3 m-2 bg-base-100 rounded-2xl" key={track.id}>
                  <button className="btn btn-ghost btn-sm mb-4 ml-4 p-1 hover:bg-error absolute z-10 top-2 right-2" onClick={() => removeFromRecommendations(track.id)} aria-label={`Remove ${track.name}`}>
                    <XMark />
                  </button>
                  <div className="flex flex-row gap-2 hover:bg-opacity-60">
                    <Image className="rounded-sm h-24 w-24 md:h-[120px] md:w-[120px] object-cover" src={track.album?.images?.[0]?.url || "https://picsum.photos/120"} alt={track.album?.name || track.name} width={120} height={120} />
                    <div className="relative flex flex-col p-2 w-full min-w-0">
                      <h2 className="text-medium break-words pr-5">{track.name}</h2>
                      <h4 className="text-xs break-words">{track.artists?.map((artist) => artist.name).join(", ")}</h4>
                      <div className="absolute bottom-0 flex items-center gap-1 pb-1">
                        <TrackPreview track={track} isPlaying={activePreviewId === track.id} onToggle={() => togglePreview(track)} />
                        <a className="flex flex-row items-center gap-1" rel="noopener noreferrer" target="_blank" href={track.external_urls?.spotify}>
                          <SpotifyIcon theme={theme} width={16} height={16} /><span className="text-xs">Play on Spotify</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="tooltip tooltip-secondary" data-tip="Recent Track Popularity"><progress className="progress progress-secondary" value={track.popularity ?? 0} max="100" /></div>
                </li>
              ))}
              {isProcessing && recommendations.length > 0 && <li className="p-4 text-center text-sm opacity-70">Finding more tracks...</li>}
            </ul>
          )}
          <footer className="absolute bottom-0 left-0 right-0 z-20 flex w-full flex-nowrap items-center justify-center gap-1 bg-base-200/90 p-2 backdrop-blur md:gap-2 md:p-4">
            <button className="btn btn-primary btn-xs shrink-0 md:btn-sm" onClick={() => refreshRecommendations()} disabled={isProcessing} aria-label="Refresh recommendations"><ArrowPath /></button>
            <button className="btn btn-secondary btn-xs shrink-0 whitespace-nowrap md:btn-sm" onClick={openAddMore} disabled={isProcessing || maxAdditionalTracks === 0}>Add tracks</button>
            <button className="btn btn-success btn-xs shrink-0 whitespace-nowrap md:btn-sm" onClick={() => setIsSettingsOpen(true)} disabled={recommendations.length < 2}>Create playlist ({recommendations.length})</button>
          </footer>
        </article>
      </section>
      <audio ref={audioRef} preload="none" />
      <section className="w-screen h-full" />
      {isAddMoreOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/60 p-4" role="dialog" aria-modal="true" aria-labelledby="add-tracks-title">
        <form className="w-full max-w-sm rounded-box bg-base-100 p-5 shadow-2xl" onSubmit={(event) => { event.preventDefault(); addMoreTracks(additionalTrackCount); setIsAddMoreOpen(false); }}>
          <div className="mb-4 flex items-start justify-between gap-3"><div><h2 id="add-tracks-title" className="text-lg font-bold">Add more tracks</h2><p className="mt-1 text-sm opacity-70">Your playlist has {recommendations.length} tracks. Spotify allows up to 100 here.</p></div><button className="btn btn-circle btn-ghost btn-sm" type="button" onClick={() => setIsAddMoreOpen(false)} aria-label="Close add tracks dialog"><XMark /></button></div>
          <label className="form-control"><span className="flex items-center justify-between gap-2 font-semibold"><span>Tracks to add</span><output className="badge badge-secondary">{additionalTrackCount}</output></span><input className="range range-secondary range-sm mt-2" type="range" min="1" max={maxAdditionalTracks} step="1" value={additionalTrackCount} onChange={(event) => setAdditionalTrackCount(Number(event.target.value))} /><span className="flex justify-between text-xs opacity-60"><span>1 track</span><span>{maxAdditionalTracks} max</span></span></label>
          <div className="mt-5 flex justify-end gap-2"><button className="btn btn-ghost btn-sm" type="button" onClick={() => setIsAddMoreOpen(false)}>Cancel</button><button className="btn btn-secondary btn-sm" type="submit" disabled={isProcessing || maxAdditionalTracks === 0}>Add {additionalTrackCount} tracks</button></div>
        </form>
      </div>}
      {isSettingsOpen && <PlaylistSettingsModal settings={playlistSettings} onClose={() => setIsSettingsOpen(false)} onCreate={(settings) => { setIsSettingsOpen(false); createPlaylist(settings); }} />}
    </main>
  );
};

export default Recommendations;
