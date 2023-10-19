import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsersTopArtists } from "@/utils/usersTopArtists";
import getAccessToken from "@/utils/getAccessToken";
import Image from "next/image";

function UsersTopArtists({ user_id, setIsLoading }) {
  const [usersTopArtists, setUsersTopArtists] = useState(null);

  useEffect(() => {
    const fetchUsersTopArtists = async () => {
      try {
        const access_token = await getAccessToken();
        const data = await getUsersTopArtists(user_id, access_token);
        console.log(data);
        setUsersTopArtists(data);
      } catch (err) {
        console.log(err);
      }
      setTimeout(() => {
        // Setting 1 seconds delay, assuming the rendering time.
        setIsLoading(false);
      }, 1000);
    };

    fetchUsersTopArtists();
  }, [user_id]);

  return (
    <main className="flex flex-col gap-2 bg-base-200 p-2 md:p-4 rounded-xl items-center shadow-md ">
      <h1 className="text-3xl md:text-4xl">Your Recent Top Artists</h1>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-2 place-items-center">
        {usersTopArtists?.length === 0 ?  (
          <div className="break-words bg-base-200 p-4 grid grid-cols-1 w-52 md:w-96 gap-2">
            <h1 className="text-2xl">No top artists.</h1>
            <p>
              It may be that your Spotify account is new or you haven&apos;t
              listened much songs in recent time, no worries you can choose upto
              5 geners from below and then you&apos;ll get recommendations based on
              those genres.
            </p>
          </div>
        ): null}
        {usersTopArtists?.map((artist) => (
          <div className="flex flex-col p-2 bg-base-100 rounded-lg" key={artist.id}>
            <div className="relative">
              <Image
                className="rounded-md h-44 w-44 object-cover shadow-lg"
                src={artist.images[1].url}
                alt={artist.name}
                width={240}
                height={240}
              />
              <div className="absolute rounded-md bg-base-200 opacity-0 hover:opacity-100 hover:bg-neutral/75 inset-0 p-2">
                <a
                  className="flex flex-row gap-1 p-2 absolute inset-x-0 bottom-0"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={artist.external_urls.spotify}
                >
                  <Image
                    width={16}
                    height={16}
                    src="/spotify_icons/Spotify_Icon_RGB_Green.png"
                    alt="spotify_logo"
                  ></Image>
                  <p className="text-xs text-gray-100">OPEN IN SPOTIFY</p>
                </a>
              </div>
            </div>
            <h2 className="break-words mt-1">{artist.name}</h2>
            <div className="tooltip tooltip-secondary" data-tip="Recent Global Popularity">
              <progress
                className="progress progress-secondary"
                value={artist.popularity}
                max="100"
              ></progress>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default UsersTopArtists;
