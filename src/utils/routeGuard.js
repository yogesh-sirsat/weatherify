import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const routeGuard = () => {
    if (!Cookies.get("refresh_token")) {
        return redirect("/signin");
    }
};

export default routeGuard;