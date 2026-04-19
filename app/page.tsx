import { redirect } from "next/navigation";
import { getHomeMode } from "./home-mode";

export default function HomePageRouter() {
  const mode = getHomeMode();
  redirect(mode === "store" ? "/store" : "/client");
}
