import { HomeFeed } from "@/components/home-feed";
import { MobileRuntime } from "@/components/mobile-runtime";

export default function Home() {
  return (
    <MobileRuntime>
      <HomeFeed />
    </MobileRuntime>
  );
}
