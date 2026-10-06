"use client";

import Link from "next/link";
import { useState } from "react";

type Stage = "watch" | "build" | "solve" | "done";

const FRUIT = ["🍊", "🍎", "🍐", "🍋"];

export function CountingActivity() {
  const [stage, setStage] = useState<Stage>("watch");
  const [built, setBuilt] = useState<number[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [message, setMessage] = useState("");

  function chooseAnswer(answer: number) {
    if (answer === FRUIT.length) {
      setMessage("You found them all! Four little fruits make four.");
      setStage("done");
    } else {
      setMessage("Let’s count the fruit together, one at a time.");
    }
  }

  function reset() {
    setBuilt([]);
    setMessage("");
    setStage("watch");
  }

  return (
    <main className="activity-shell">
      <header className="activity-header">
        <Link className="back-link" href="/math" aria-label="Back to math">←</Link>
        <div><span className="activity-eyebrow">MATH · COUNTING</span><h1>Count the fruit</h1></div>
        <span className="activity-level">🌱 <span>Level 1</span></span>
      </header>

      <nav className="stage-tabs" aria-label="Learning steps">
        {(["watch", "build", "solve"] as const).map((step, index) => (
          <button className={`stage-tab ${stage === step ? "active" : ""} ${stage === "done" ? "complete" : ""}`} key={step} onClick={() => stage !== "done" && setStage(step)}>
            <span>{index === 0 ? "👀" : index === 1 ? "🖐️" : "⭐"}</span>
            <span>{step === "watch" ? "Watch" : step === "build" ? "Build" : "Solve"}</span>
          </button>
        ))}
      </nav>

      <section className="activity-board">
        <div className="activity-prompt">
          <span className="prompt-mascot" aria-hidden="true">🐻</span>
          <p>{stage === "watch" ? "Let’s look carefully. How many fruits do you see?" : stage === "build" ? "Tap each fruit to put it in your basket." : stage === "solve" ? "How many fruits are in the basket?" : "You did it! You saw it, built it, and solved it."}</p>
        </div>

        <div className={`fruit-scene ${stage === "build" ? "building" : ""}`}>
          {FRUIT.map((fruit, index) => (
            <button
              className={`fruit-piece ${stage === "build" && built.includes(index) ? "in-basket" : ""}`}
              key={fruit}
              onClick={() => stage === "build" && !built.includes(index) && setBuilt([...built, index])}
              aria-label={`Fruit ${index + 1}${built.includes(index) ? ", in basket" : ""}`}
              disabled={stage !== "build" || built.includes(index)}
            >{fruit}<span className="fruit-count">{stage === "watch" ? index + 1 : ""}</span></button>
          ))}
          {stage === "build" && <div className="basket" aria-label={`${built.length} fruits in basket`}>{built.map((index) => <span key={index}>{FRUIT[index]}</span>)}<small>{built.length} / {FRUIT.length}</small></div>}
          {stage === "solve" && <div className="equation-bar"><span>🍊 🍎 🍐 🍋</span><b>=</b><strong>?</strong></div>}
        </div>

        {stage === "watch" && <div className="watch-count" aria-label="Four fruits">1 <span>·</span> 2 <span>·</span> 3 <span>·</span> 4</div>}
        {stage === "build" && <div className="build-footer"><span>In your basket</span><strong>{built.length} <small>of 4</small></strong><button className="primary-action" onClick={() => { if (built.length === FRUIT.length) { setMessage(""); setStage("solve"); } else { setMessage("Choose every fruit to fill the basket."); } }}>All in! <span aria-hidden="true">→</span></button></div>}
        {stage === "solve" && <div className="answer-options" aria-label="Choose the number of fruits">{[3, 4, 5].map((answer) => <button className="answer-button" key={answer} onClick={() => chooseAnswer(answer)}>{answer}</button>)}</div>}
        {(stage === "done" || message) && <div className="kind-feedback" role="status"><span aria-hidden="true">✨</span> {message}</div>}
        {stage === "done" && <button className="primary-action replay-action" onClick={reset}>Play again <span aria-hidden="true">↻</span></button>}
      </section>

      <div className="help-row">
        <button className={`help-button ${hintOpen ? "selected" : ""}`} onClick={() => setHintOpen(!hintOpen)}><span>💡</span> Need a hint?</button>
        <button className="help-button" onClick={() => setTeacherOpen(!teacherOpen)}><span>✋</span> Ask your teacher</button>
      </div>
      {(hintOpen || teacherOpen) && <aside className="teacher-note"><strong>{teacherOpen ? "Teacher card · Count together" : "A little look"}</strong><p>{teacherOpen ? "Say: Let’s touch each fruit as we count. Ask: What number comes after three? Mix-up: Count each fruit just once." : "Point to each fruit as you count: one, two, three, four."}</p></aside>}
    </main>
  );
}
