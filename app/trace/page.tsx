import { ModuleStarter } from "../module-starter";

export default function TracePage() {
  return <ModuleStarter title="लेखौँ" english="Trace" icon="✏️" accent="trace" foundation="Before letters, little hands learn the lines and curves that make writing possible." steps={["Lines", "Shapes", "Letters"]} activityHref="/trace/practice" />;
}
