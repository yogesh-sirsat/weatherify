import React, { FC, useMemo, useState } from "react";
import Genres from "./Genres";
import { CustomAudioFeatures } from "@/types/spotify";
import { activityPresets, getMoodActivityFeatures, MoodActivityPriority, moodPresets } from "@/utils/moodActivityPresets";

interface MoodActivityRecommendationsProps {
  selectedGenres: Set<string>;
  setSelectedGenres: React.Dispatch<React.SetStateAction<Set<string>>>;
  onGenerate: (features: CustomAudioFeatures, discoverNewMusic: boolean, trackCount: number) => void;
  isProcessing: boolean;
  trackCount: number;
  setTrackCount: (count: number) => void;
}

const MoodActivityRecommendations: FC<MoodActivityRecommendationsProps> = ({
  selectedGenres, setSelectedGenres, onGenerate, isProcessing, trackCount, setTrackCount,
}) => {
  const [moodId, setMoodId] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [priority, setPriority] = useState<MoodActivityPriority>("Balanced");
  const [discoverNewMusic, setDiscoverNewMusic] = useState(false);
  const [error, setError] = useState("");
  const features = useMemo(() => getMoodActivityFeatures(moodId, activityId, priority), [moodId, activityId, priority]);

  const choose = (type: "mood" | "activity", id: string) => {
    setError("");
    if (type === "mood") setMoodId((current) => current === id ? null : id);
    else setActivityId((current) => current === id ? null : id);
  };

  const generate = () => {
    if (!features) {
      setError("Choose a mood, an activity, or both before generating.");
      return;
    }
    onGenerate(features, discoverNewMusic, trackCount);
  };

  return (
    <section className="w-full max-w-5xl rounded-box bg-base-200 p-4 shadow-md">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-accent">Mood x Activity</h1>
        <p className="text-sm opacity-70">Choose either side on its own, or combine both to shape one playlist.</p>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-box bg-base-100 p-4">
          <h2 className="mb-3 text-lg font-bold text-accent">How do you feel?</h2>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {moodPresets.map((mood) => <button key={mood.id} type="button" className={`btn !h-auto !min-h-16 w-full min-w-0 items-start justify-start overflow-hidden !whitespace-normal break-words !py-3 text-left leading-snug ${moodId === mood.id ? "btn-accent" : "btn-outline"}`} onClick={() => choose("mood", mood.id)}><span className="min-w-0 break-words"><span className="block break-words font-semibold">{mood.label}</span><span className="block break-words text-xs font-normal opacity-70">{mood.description}</span></span></button>)}
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-box bg-base-100 p-4">
          <h2 className="mb-3 text-lg font-bold text-accent">What are you doing?</h2>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {activityPresets.map((activity) => <button key={activity.id} type="button" className={`btn !h-auto !min-h-16 w-full min-w-0 items-start justify-start overflow-hidden !whitespace-normal break-words !py-3 text-left leading-snug ${activityId === activity.id ? "btn-accent" : "btn-outline"}`} onClick={() => choose("activity", activity.id)}><span className="min-w-0 break-words"><span className="block break-words font-semibold">{activity.label}</span><span className="block break-words text-xs font-normal opacity-70">{activity.description}</span></span></button>)}
          </div>
        </section>
      </div>

      <div className="mt-5 rounded-box bg-base-100 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">When both are selected</span><span className="badge badge-ghost">{priority}</span></div>
        <div className="join w-full">
          {(["Mood", "Balanced", "Activity"] as MoodActivityPriority[]).map((option) => <input key={option} className="join-item btn btn-outline btn-accent flex-1" type="radio" name="mood-activity-priority" aria-label={option} checked={priority === option} onChange={() => setPriority(option)} />)}
        </div>
        <p className="mt-2 text-xs opacity-70">Balanced mixes both. Mood or Activity gives that choice more influence. If only one is selected, it is used on its own.</p>
      </div>

      <div className="mt-5 rounded-box bg-base-100 p-4"><Genres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} /></div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-box border border-base-300 p-4">
        <div><span className="font-semibold">Discover new music</span><p className="text-xs opacity-70">Use genres instead of your top artists as seeds when no genres are selected.</p></div>
        <input className="toggle toggle-accent" type="checkbox" checked={discoverNewMusic} onChange={(event) => setDiscoverNewMusic(event.target.checked)} aria-label="Discover new music" />
      </div>

      <label className="mt-5 flex flex-col gap-2 rounded-box bg-base-100 p-4"><span className="flex items-center justify-between gap-2 font-semibold"><span>Tracks to generate</span><output className="badge badge-primary">{trackCount}</output></span><span className="text-xs opacity-70">Choose the size of this playlist.</span><input className="range range-primary range-sm" type="range" min="5" max="100" step="5" value={trackCount} onChange={(event) => setTrackCount(Number(event.target.value))} /><span className="flex justify-between text-xs opacity-60"><span>5 tracks</span><span>100 tracks</span></span></label>

      {error && <p className="alert alert-warning mt-4 text-sm">{error}</p>}
      <button className="btn btn-primary mt-5 w-full" type="button" disabled={isProcessing} onClick={generate}>{isProcessing ? <><span className="loading loading-spinner loading-sm" />Generating...</> : "Generate mood playlist"}</button>
    </section>
  );
};

export default MoodActivityRecommendations;
