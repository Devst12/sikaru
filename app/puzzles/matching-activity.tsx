"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import bundledShapes from "@/content/shape-pairs.json";

type ShapeCard = { id: string; shape: string; label: string };

function makeCards(pairs: typeof bundledShapes[number]["pairs"]): ShapeCard[] {
  return pairs.flatMap((pair) => [
    { ...pair, id: `${pair.id}-a` },
    { ...pair, id: `${pair.id}-b` },
  ]);
}

export function MatchingActivity() {
  const [cards, setCards] = useState<ShapeCard[]>(() => makeCards(bundledShapes[0].pairs));
  const [title, setTitle] = useState(bundledShapes[0].title);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [contentNotice, setContentNotice] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/content?kind=shape-pairs")
      .then((response) => {
        if (!response.ok) throw new Error("Content request failed");
        return response.json() as Promise<{ items: typeof bundledShapes }>;
      })
      .then((data) => {
        const puzzle = data.items[0];
        if (!active || !puzzle) return;
        setCards(makeCards(puzzle.pairs));
        setTitle(puzzle.title);
      })
      .catch(() => {
        console.error("[puzzles] Content refresh failed; bundled cards are still available.");
        if (active) setContentNotice("We’re using the ready-to-play starter shapes.");
      });
    return () => { active = false; };
  }, []);

  function pickCard(id: string, shape: string) {
    if (open.includes(id) || matched.includes(id) || open.length === 2) return;
    const next = [...open, id];
    setOpen(next);
    if (next.length === 2) {
      const first = cards.find((card) => card.id === next[0]);
      if (first?.shape === shape) {
        setMatched([...matched, ...next]);
        setOpen([]);
      } else {
        setOpen([id]);
      }
    }
  }

  function reset() {
    setOpen([]);
    setMatched([]);
  }

  const complete = matched.length === cards.length;
  const hintCardId = cards[0]?.id;

  return (
    <main className="activity-shell puzzle-activity">
      <header className="activity-header">
        <Link className="back-link" href="/puzzles" aria-label="Back to puzzles">←</Link>
        <div><span className="activity-eyebrow">PUZZLES · MATCH</span><h1>{title}</h1></div>
        <span className="activity-level">🌱 <span>Level 1</span></span>
      </header>
      <div className="puzzle-prompt"><span aria-hidden="true">🦊</span><p>{complete ? "You found all the matching shapes!" : "Turn over two shapes. Do they look the same?"}</p></div>
      <section className="matching-board" aria-label="Shape matching game">
        {cards.map((card) => {
          const revealed = open.includes(card.id) || matched.includes(card.id) || (hintOpen && card.id === hintCardId);
          return <button
            className={`shape-card ${revealed ? "revealed" : ""} ${matched.includes(card.id) ? "matched" : ""}`}
            key={card.id}
            onClick={() => pickCard(card.id, card.shape)}
            aria-label={revealed ? card.label : "Hidden shape"}
            aria-pressed={revealed}
            disabled={matched.includes(card.id)}
          ><span>{revealed ? card.shape : "?"}</span>{revealed && <small>{card.label}</small>}</button>;
        })}
      </section>
      {contentNotice && <p className="content-notice" role="status">{contentNotice}</p>}
      {complete && <div className="kind-feedback" role="status"><span aria-hidden="true">✨</span> Every shape has a friend!</div>}
      <div className="puzzle-bottom-row">
        {complete && <button className="primary-action" onClick={reset}>Play again <span aria-hidden="true">↻</span></button>}
        <div className="help-row">
          <button className={`help-button ${hintOpen ? "selected" : ""}`} onClick={() => setHintOpen(!hintOpen)}><span>💡</span> Need a hint?</button>
          <button className="help-button" onClick={() => setTeacherOpen(!teacherOpen)}><span>✋</span> Ask your teacher</button>
        </div>
      </div>
      {(hintOpen || teacherOpen) && <aside className="teacher-note"><strong>{teacherOpen ? "Teacher card · Notice shape" : "A little look"}</strong><p>{teacherOpen ? "Say: Let’s look at the edges and corners. Ask: Can you find another one with this same shape? Mix-up: Shapes can match even when their colors are different." : "Look for two cards with the same outline. Try the round shape first."}</p></aside>}
    </main>
  );
}
