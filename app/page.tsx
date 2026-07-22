import {
  buildVideoFeed,
  communityProjects,
} from "@/lib/videoFeed";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { HfExploreHome } from "@/components/HfExploreHome";

/**
 * Higgsfield-class Explore home — single client surface, video-first.
 */
export default function Home() {
  return (
    <HfExploreHome
      demos={DEMO_VIDEOS}
      projects={communityProjects()}
      feed={buildVideoFeed()}
    />
  );
}
