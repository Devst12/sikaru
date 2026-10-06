import Link from "next/link";

type ModuleStarterProps = {
  title: string;
  english: string;
  icon: string;
  accent: "math" | "puzzle" | "trace";
  foundation: string;
  steps: [string, string, string];
};

export function ModuleStarter({ title, english, icon, accent, foundation, steps }: ModuleStarterProps) {
  return (
    <main className="module-shell">
      <header className="module-header">
        <Link className="back-link" href="/" aria-label="Back to learning garden">←</Link>
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">s</span><span>sikaru<span className="brand-dot">.</span></span></Link>
        <span className="module-header-label">LET’S LEARN</span>
      </header>
      <section className={`module-welcome ${accent}`}>
        <div className="module-welcome-icon" aria-hidden="true">{icon}</div>
        <p className="section-kicker">{english.toUpperCase()} GARDEN</p>
        <h1>{title} <span>{english}</span></h1>
        <p>{foundation}</p>
      </section>
      <section className="learning-path" aria-label="Our learning steps">
        {steps.map((step, index) => (
          <div className="path-step" key={step}>
            <span className="path-number">{index + 1}</span>
            <strong>{step}</strong>
            {index < steps.length - 1 && <span className="path-connector" aria-hidden="true">······›</span>}
          </div>
        ))}
      </section>
      <section className="module-ready">
        <div className="ready-illustration" aria-hidden="true">🌱</div>
        <div>
          <h2>Every strong start begins small.</h2>
          <p>We’re growing the first activities from the very beginning, one friendly step at a time.</p>
        </div>
        <Link className="home-return" href="/">Back to all activities <span aria-hidden="true">↗</span></Link>
      </section>
      <footer className="module-footer">सबल जग बलियो जग <span>·</span> A strong foundation for every little learner</footer>
    </main>
  );
}
