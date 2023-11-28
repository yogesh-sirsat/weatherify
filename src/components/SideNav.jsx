import Image from "next/image";
import Cookies from "js-cookie";

function SideNav({ user, isHamburger, selectedTab, setSelectedTab }) {

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
      }  flex-col w-64 fixed xl:sticky h-screen px-4 py-8 bg-base-200 z-10 shadow-xl duration-500 ease-in-out`}
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
            quality={90}
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
              <a className={selectedTab === "weather x time" ? "active" : ""} onClick={() => setSelectedTab("weather x time")}
              >Weather x Time</a>
            </li>
            <li>
              <a className={selectedTab === "mood x activity" ? "active" : ""} onClick={() => setSelectedTab("mood x activity")}>Mood x Activity</a>
            </li>
            <li>
              <a className={selectedTab === "you x custom" ? "active" : ""} onClick={() => setSelectedTab("you x custom")}>You x Custom</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="divider"></div>
      <footer>
        <ul className="menu bg-base-100 flex flex-col gap-2 rounded-box w-full">
          <select data-choose-theme defaultValue={'Pick The Color Theme!'} className="select select-sm">
            <option value="synthwave">Synthwave - Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="retro">Retro</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="valentine">Valentine</option>
            <option value="aqua">Aqua</option>
            <option value="forest">Forest</option>
          </select>
          <li>
            <a className="hover:bg-error" onClick={handleDisconnect}>
              Disconnect
            </a>
          </li>
        </ul>
      </footer>
    </aside>
  );
}

export default SideNav;
