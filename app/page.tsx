import {
  buildHomeShowcaseFeed,
  communityProjects,
} from "@/lib/videoFeed";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { HfExploreHome } from "@/components/HfExploreHome";

/**
 * Soft-launch Explore home — video-first, honest density (≤8 unique demos).
 */
export default function Home() {
  const showcase = buildHomeShowcaseFeed();
  // Only demos used by the showcase so feature row reuses the same unique set.
  const demos = showcase.map((item) => item.demo);
  return (
    <HfExploreHome
      demos={demos.length ? demos : DEMO_VIDEOS.slice(0, 8)}
      projects={communityProjects()}
      feed={showcase}
    />
  );
}
