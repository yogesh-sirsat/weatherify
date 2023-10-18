import Image from "next/image";
import { useEffect, useState } from "react";
import axiosConfig from "@/config/axiosConfig";
import Cookies from "js-cookie";
import SideNav from "./SideNav";

function Navbar({selectedTab, setSelectedTab}) {
  const [user, setUser] = useState({});
  const [isHamburger, setIsHamburger] = useState(true);

  useEffect(() => {
    if (!user.id) {
      getUserProfileData();
    }
  }, []);

  const getUserProfileData = async () => {
    console.log("getUserProfileData");
    try {
      const user_id = Cookies.get("user_id");
      if (localStorage.getItem(user_id)) {
        setUser(JSON.parse(localStorage.getItem(user_id)));
        return;
      }
      const response = await axiosConfig.get(`mongodb/user?id=${user_id}`);
      setUser(response.data.user);
      localStorage.setItem(user_id, JSON.stringify(response.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = () => {
    Cookies.remove("user_id");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/signin";
  };

  return (
    <>
      <nav className="lg:hidden navbar bg-base-100 fixed top-0 inset-x-0 z-10 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl normal-case">Weatherify</a>
        </div>
        <div className="flex-none">
          <label className="btn btn-ghost swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" checked={!isHamburger} onChange={() => setIsHamburger(!isHamburger)} />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </div>
      </nav>
      <SideNav user={user} handleDisconnect={handleDisconnect} {...{ isHamburger, selectedTab }} setSelectedTab={setSelectedTab} />
    </>
  );
}

export default Navbar;
