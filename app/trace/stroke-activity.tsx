"use client";

import Link from "next/link";
import { useState, type PointerEvent } from "react";

const STROKES = [
  { name: "Standing line", glyph: "│", path: "M300 52 L300 248", start: { x: 300, y: 52 } },
  { name: "Sleeping line", glyph: "─", path: "M130 150 L470 150", start: { x: 130, y: 150 } },
  { name: "Slanting line", glyph: "╱", path: "M170 238 L430 62", start: { x: 170, y: 238 } },
  { name: "Curve", glyph: "⌒", path: "M145 190 Q300 35 455 190", start: { x: 145, y: 190 } },
  { name: "Circle", glyph: "○", path: "M385 150 A85 85 0 1 1 215 150 A85 85 0 1 1 385 150", start: { x: 385, y: 150 } },
  { name: "Zigzag", glyph: "⌁", path: "M130 180 L215 92 L300 180 L385 92 L470 180", start: { x: 130, y: 180 } },
  { name: "Loop", glyph: "∞", path: "M300 150 C250 70 175 100 215 160 C245 205 280 185 300 150 C320 115 355 95 385 125 C430 170 360 215 300 150", start: { x: 300, y: 150 } },
];

type DrawPoint = { x: number; y: number };

export function StrokeActivity() {
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [points, setPoints] = useState<DrawPoint[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const selectedStroke = STROKES[strokeIndex];

  function readPoint(event: PointerEvent<SVGSVGElement>): DrawPoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 600,
      y: ((event.clientY - rect.top) / rect.height) * 300,
    };
  }

  function startDrawing(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setPoints([readPoint(event)]);
    setDrawing(true);
    setMessage("");
  }

  function continueDrawing(event: PointerEvent<SVGSVGElement>) {
    if (!drawing) return;
    setPoints((current) => [...current, readPoint(event)]);
  }

  function endDrawing() {
    if (!drawing) return;
    setDrawing(false);
    setMessage("Lovely lines! You’re learning the shape with your hand.");
  }

  function clearStroke() {
    setPoints([]);
    setMessage("");
  }

  function nextStroke() {
    if (strokeIndex < STROKES.length - 1) {
      setStrokeIndex(strokeIndex + 1);
    } else {
      setStrokeIndex(0);
      setMessage("You practiced every first stroke. A strong start!");
    }
    setPoints([]);
  }

  const drawnPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <main className="activity-shell trace-activity">
      <header className="activity-header">
        <Link className="back-link" href="/trace" aria-label="Back to tracing">←</Link>
        <div><span className="activity-eyebrow">TRACE · FIRST STROKES</span><h1>Practice a {selectedStroke.name.toLowerCase()}</h1></div>
        <span className="activity-level">✏️ <span>{strokeIndex + 1} of {STROKES.length}</span></span>
      </header>
      <div className="puzzle-prompt"><span aria-hidden="true">🐰</span><p>Follow the dotted path with your finger or a pen.</p></div>
      <div className="stroke-picker" aria-label="Choose a practice stroke">
        {STROKES.map((stroke, index) => <button className={index === strokeIndex ? "selected" : ""} key={stroke.name} onClick={() => { setStrokeIndex(index); setPoints([]); setMessage(""); }} aria-label={stroke.name} aria-current={index === strokeIndex ? "step" : undefined}>{stroke.glyph}</button>)}
      </div>
      <div className="paper-wrap">
        <svg
          className="practice-paper"
          viewBox="0 0 600 300"
          role="img"
          aria-label={`${selectedStroke.name} tracing canvas`}
          onPointerDown={startDrawing}
          onPointerMove={continueDrawing}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
        >
          <path className="paper-rule" d="M25 75 H575 M25 150 H575 M25 225 H575" />
          <path className="trace-guide" d={selectedStroke.path} />
          {points.length > 0 && <>
            <circle className="start-dot" cx={points[0].x} cy={points[0].y} r="10" />
            <path className="child-stroke" d={drawnPath} />
          </>}
          {points.length === 0 && <circle className="start-dot" cx={selectedStroke.start.x} cy={selectedStroke.start.y} r="10" />}
        </svg>
      </div>
      {message && <div className="kind-feedback" role="status"><span aria-hidden="true">✨</span> {message}</div>}
      <div className="trace-actions"><button className="secondary-action" onClick={clearStroke}>Clear <span aria-hidden="true">↺</span></button><button className="primary-action" onClick={nextStroke}>Next stroke <span aria-hidden="true">→</span></button></div>
      <div className="help-row">
        <button className={`help-button ${hintOpen ? "selected" : ""}`} onClick={() => setHintOpen(!hintOpen)}><span>💡</span> Need a hint?</button>
        <button className="help-button" onClick={() => setTeacherOpen(!teacherOpen)}><span>✋</span> Ask your teacher</button>
      </div>
      {(hintOpen || teacherOpen) && <aside className="teacher-note"><strong>{teacherOpen ? "Teacher card · Start at the dot" : "A little look"}</strong><p>{teacherOpen ? "Say: Watch my finger follow the line. Ask: Which way will your hand go? Mix-up: Let your child move at their own pace; direction comes before neatness." : "Start at the green dot. Move slowly along the soft blue line."}</p></aside>}
    </main>
  );
}
