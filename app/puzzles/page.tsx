import { ModuleStarter } from "../module-starter";

export default function PuzzlesPage() {
  return <ModuleStarter title="खेलौँ" english="Puzzles" icon="🧩" accent="puzzle" foundation="First we notice what matches. Then we sort, find patterns, and fit the pieces." steps={["Look", "Match", "Make"]} activityHref="/puzzles/match" />;
}
