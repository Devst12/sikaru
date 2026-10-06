import { ModuleStarter } from "../module-starter";

export default function MathPage() {
  return <ModuleStarter title="गणित" english="Math" icon="🍊" accent="math" foundation="We start with real things you can see and count. Then we build the idea together." steps={["See it", "Build it", "Solve it"]} activityHref="/math/counting" />;
}
