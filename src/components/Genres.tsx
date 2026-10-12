import React, { FC, useEffect } from "react";

interface GenresProps {
  selectedGenres: Set<string>;
  setSelectedGenres: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const genres: string[] = [
  "acoustic",
  "ambient",
  "anime",
  "chill",
  "classical",
  "club",
  "country",
  "dance",
  "death-metal",
  "edm",
  "electronic",
  "folk",
  "funk",
  "groove",
  "guitar",
  "heavy-metal",
  "hip-hop",
  "indie",
  "indie-pop",
  "jazz",
  "k-pop",
  "metal",
  "opera",
  "party",
  "piano",
  "pop",
  "rock",
  "rock-n-roll",
  "r-n-b",
  "reggae",
  "soul",
  "trance",
  "trip-hop",
];

const Genres: FC<GenresProps> = ({ selectedGenres, setSelectedGenres }) => {
  useEffect(() => {
    console.log(selectedGenres);
  }, [selectedGenres]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelectedGenres) => {
      const newSelectedGenres = new Set(prevSelectedGenres);
      if (newSelectedGenres.has(genre)) {
        newSelectedGenres.delete(genre);
      } else {
        if (newSelectedGenres.size >= 5) {
          return newSelectedGenres;
        }
        newSelectedGenres.add(genre);
      }
      return newSelectedGenres;
    });
  };

  return (
    <section className="grid grid-cols-1 gap-2 w-full">
      <div>
        <h2 className="text-xl font-bold text-accent">
          Genres(max 5): {selectedGenres.size}
        </h2>
      </div>
      <div className="flex flex-wrap gap-1">
        {genres.map((genre) => {
          const isSelected = selectedGenres.has(genre);
          return (
            <button
              className={`btn btn-accent btn-xs rounded-full ${
                isSelected ? "" : "btn-outline"
              }`}
              key={genre}
              onClick={() => toggleGenre(genre)}
            >
              {genre.toUpperCase()}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Genres;
