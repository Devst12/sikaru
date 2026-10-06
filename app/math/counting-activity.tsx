"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import bundledCounting from "@/content/math-counting.json";

type Stage = "watch" | "build" | "solve" | "done";
type CountingLesson = typeof bundledCounting[number];

const STARTER_LESSON = bundledCounting[0];

export function CountingActivity() {
  const [lesson, setLesson] = useState<CountingLesson>(STARTER_LESSON);
  const [stage, setStage] = useState<Stage>("watch");
  const [built, setBuilt] = useState<number[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/content?kind=math-counting")
      .then((response) => {
        if (!response.ok) throw new Error("Content request failed");
        return response.json() as Promise<{ items: CountingLesson[] }>;
      })
      .then((data) => {
        if (active && data.items[0]) setLesson(data.items[0]);
      })
      .catch(() => {
        console.error("[math] Content refresh failed; bundled counting lesson is still available.");
      });
    return () => { active = false; };
  }, []);

  function chooseAnswer(answer: number) {
    if (answer === lesson.answer) {
      setMessage(`You found them all! ${lesson.answer} little fruits make ${lesson.answer}.`);
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
        <div><span className="activity-eyebrow">MATH · COUNTING</span><h1>{lesson.title}</h1></div>
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
          <p>{stage === "watch" ? lesson.question : stage === "build" ? "Tap each fruit to put it in your basket." : stage === "solve" ? "How many fruits are in the basket?" : "You did it! You saw it, built it, and solved it."}</p>
        </div>

        <div className={`fruit-scene ${stage === "build" ? "building" : ""}`}>
          {lesson.objects.map((fruit, index) => (
            <button
              className={`fruit-piece ${stage === "build" && built.includes(index) ? "in-basket" : ""}`}
              key={fruit.id}
              onClick={() => stage === "build" && !built.includes(index) && setBuilt([...built, index])}
              aria-label={`${fruit.name} ${index + 1}${built.includes(index) ? ", in basket" : ""}`}
              disabled={stage !== "build" || built.includes(index)}
            >{fruit.icon}<span className="fruit-count">{stage === "watch" ? index + 1 : ""}</span></button>
          ))}
          {stage === "build" && <div className="basket" aria-label={`${built.length} fruits in basket`}>{built.map((index) => <span key={lesson.objects[index].id}>{lesson.objects[index].icon}</span>)}<small>{built.length} / {lesson.answer}</small></div>}
          {stage === "solve" && <div className="equation-bar"><span>{lesson.objects.map((fruit) => fruit.icon).join(" ")}</span><b>=</b><strong>?</strong></div>}
        </div>

        {stage === "watch" && <div className="watch-count" aria-label={`${lesson.answer} fruits`}>{lesson.objects.map((fruit, index) => <span key={fruit.id}>{index > 0 && <i>·</i>}{index + 1}</span>)}</div>}
        {stage === "build" && <div className="build-footer"><span>In your basket</span><strong>{built.length} <small>of {lesson.answer}</small></strong><button className="primary-action" onClick={() => { if (built.length === lesson.answer) { setMessage(""); setStage("solve"); } else { setMessage("Choose every fruit to fill the basket."); } }}>All in! <span aria-hidden="true">→</span></button></div>}
        {stage === "solve" && <div className="answer-options" aria-label="Choose the number of fruits">{[lesson.answer - 1, lesson.answer, lesson.answer + 1].map((answer) => <button className="answer-button" key={answer} onClick={() => chooseAnswer(answer)}>{answer}</button>)}</div>}
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
