import { useEffect, useState } from "react";

function Genres({ selectedGenres, setSelectedGenres }) {
  const genres = [
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
    "trip-hop"
  ];

  useEffect(() => {
    console.log(selectedGenres);
  }, [selectedGenres]);

  const toggleGenre = (e, genre) => {
    
    setSelectedGenres((prevSelectedGenres) => {
      const newSelectedGenres = new Set(prevSelectedGenres);
      if (newSelectedGenres.has(genre)) {
        e.target.classList.add("btn-outline");
        newSelectedGenres.delete(genre);
      } else {
        if (newSelectedGenres.size >= 5) {
          return newSelectedGenres;
        }
        e.target.classList.remove("btn-outline");
        newSelectedGenres.add(genre);
      }
      return newSelectedGenres;
    });
  };

  return (
      <section className="grid grid-cols-1 gap-2 w-full">
        <div>
          <h2 className="text-xl font-bold text-accent">Genres(max 5): {selectedGenres.size}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre, id) => (
            <button
              className="btn btn-accent btn-xs btn-outline rounded-full"
              key={id}
              onClick={(e) => toggleGenre(e, genre)}
            >
              {genre.toUpperCase()}
            </button>
          ))}
        </div>
    </section>
  );
};

export default Genres;
