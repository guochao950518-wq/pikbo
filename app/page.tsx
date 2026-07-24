import {
  buildHomeShowcaseFeed,
  buildViralPresetsWallFeed,
} from "@/lib/videoFeed";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { listHomeShowcaseProjects } from "@/lib/showcaseProjects";
import { HfExploreHome } from "@/components/HfExploreHome";

/**
 * HF Explore home — video OS, not marketing blog.
 * Dense viral wall first; product rail; projects; honest Lab media only.
 */
export default function Home() {
  const showcase = buildHomeShowcaseFeed();
  const viralWall = buildViralPresetsWallFeed();
  const demos = showcase.map((item) => item.demo);
  return (
    <HfExploreHome
      demos={demos.length ? demos : DEMO_VIDEOS.slice(0, 8)}
      projects={listHomeShowcaseProjects()}
      feed={showcase}
      viralWall={viralWall}
    />
  );
}
