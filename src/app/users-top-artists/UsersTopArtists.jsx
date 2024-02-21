import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsersTopArtists } from "@/utils/usersTopArtists";
import getAccessToken from "@/utils/getAccessToken";
import Image from "next/image";
import SpotifyIcon from "@/components/SpotifyIcon";

function UsersTopArtists({ user_id, setIsLoading, theme }) {
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
    <main className="grid gap-2 bg-base-200 p-2 md:p-4 rounded-xl max-w-fit items-center shadow-md overflow-x-auto">
      <h1 className="text-3xl md:text-4xl font-semibold">
        Your Recent Top Artists
      </h1>
      {usersTopArtists?.length === 0 ? (
        <div className="break-words bg-base-200 p-4 flex flex-col max-w-xs gap-2">
          <h1 className="text-2xl">No top artists.</h1>
          <p>
            It may be that your Spotify account is new or you haven&apos;t
            listened much songs in recent time, no worries you can choose upto 5
            geners from below and then you&apos;ll get recommendations based on
            those genres.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-3 gap-2 place-items-center w-max overflow-x-auto">
          {usersTopArtists?.map((artist) => (
            <div
              className="flex flex-col p-2 bg-base-100 rounded-lg"
              key={artist.id}
            >
              <div className="relative">
                <Image
                  className="h-44 w-44 object-cover shadow-lg"
                  src={artist.images[1].url}
                  alt={artist.name}
                  width={240}
                  height={240}
                />
              </div>
              <h2 className="break-words mt-1">{artist.name}</h2>
              <a
                className="flex flex-row gap-1 py-1"
                rel="noopener noreferrer"
                target="_blank"
                href={artist.external_urls.spotify}
              >
                <SpotifyIcon theme={theme} width={16} height={16} />
                <p className="text-xs self-center">LISTEN ON SPOTIFY</p>
              </a>
              <div
                className="tooltip tooltip-secondary"
                data-tip="Recent Global Popularity"
              >
                <progress
                  className="progress progress-secondary"
                  value={artist.popularity}
                  max="100"
                ></progress>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default UsersTopArtists;
