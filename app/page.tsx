import Link from "next/link";

const modules = [
  {
    href: "/math",
    icon: "🍊",
    title: "गणित",
    english: "Math",
    note: "Count, build & discover",
    className: "math-card",
    badge: "01",
  },
  {
    href: "/puzzles",
    icon: "🧩",
    title: "खेलौँ",
    english: "Puzzles",
    note: "Look closely. Find a way.",
    className: "puzzle-card",
    badge: "02",
  },
  {
    href: "/trace",
    icon: "✏️",
    title: "लेखौँ",
    english: "Trace",
    note: "Start with a simple stroke",
    className: "trace-card",
    badge: "03",
  },
];

export default function Home() {
  return (
    <main className="home-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Sikaru home">
          <span className="brand-mark" aria-hidden="true">s</span>
          <span>sikaru<span className="brand-dot">.</span></span>
        </Link>
        <div className="topbar-right">
          <span className="classroom-pill"><span className="live-dot" /> CLASSROOM MODE</span>
          <button className="avatar-button" aria-label="Learner profile">🌱</button>
        </div>
      </header>

      <section className="welcome-grid" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> LEARN A LITTLE. GROW A LOT.</p>
          <h1 id="welcome-title">Big ideas start<br />with <span>little steps.</span></h1>
          <p className="welcome-description">
            See it. Make it. Then solve it.<br className="desktop-break" /> Every step builds a strong foundation.
          </p>
          <div className="foundation-note">
            <span className="foundation-sparkle" aria-hidden="true">✳</span>
            <span><strong>तयार छौ?</strong><small>Ready to learn?</small></span>
            <span className="foundation-arrow" aria-hidden="true">↓</span>
          </div>
        </div>

        <div className="growth-art" aria-hidden="true">
          <div className="sun-orbit" />
          <div className="growth-sun">☀️</div>
          <div className="growth-cloud cloud-one">☁</div>
          <div className="growth-cloud cloud-two">☁</div>
          <div className="growth-hill hill-back" />
          <div className="growth-hill hill-front" />
          <div className="seedling">
            <span className="leaf leaf-left" />
            <span className="leaf leaf-right" />
            <span className="stem" />
            <span className="soil" />
          </div>
          <span className="floating-star star-one">✦</span>
          <span className="floating-star star-two">✧</span>
          <span className="art-caption">little steps, strong roots</span>
        </div>
      </section>

      <section className="learning-section" aria-labelledby="choose-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">YOUR LEARNING GARDEN</p>
            <h2 id="choose-title">What shall we grow today?</h2>
          </div>
          <span className="section-hint">Pick one to begin <span aria-hidden="true">↘</span></span>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <Link className={`module-card ${module.className}`} href={module.href} key={module.href}>
              <div className="card-topline">
                <span className="card-number">{module.badge}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </div>
              <span className="module-icon" aria-hidden="true">{module.icon}</span>
              <div className="module-title-row">
                <h3>{module.title}</h3>
                <span>{module.english}</span>
              </div>
              <p>{module.note}</p>
              <span className="card-decoration" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-motto"><span>✿</span> सबल जग बलियो जग <i>·</i> A strong foundation for every little learner</div>
        <div className="footer-sprinkles" aria-hidden="true"><span>✳</span><span>✦</span><span>✿</span></div>
      </footer>
    </main>
  );
}
