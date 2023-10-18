import Image from "next/image";
function SideNav({ user, handleDisconnect, isHamburger, selectedTab, setSelectedTab }) {
  return (
    <aside
      className={`${
        isHamburger ? "hidden lg:flex" : "flex"
      }  flex-col fixed w-64 h-full px-4 py-8 overflow-y-auto bg-base-200 z-10 shadow-xl duration-500 ease-in-out`}
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
      <footer className="absolute bottom-0 mb-4">
        <div className="divider"></div>
        <ul className="menu bg-base-100 flex flex-col gap-2 w-56 rounded-box">
          <select data-choose-theme defaultValue={'DEFAULT'} className="select select-sm w-full max-w-s">
            <option value={'DEFAULT'} disabled>
              Pick The Color Theme!
            </option>
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
