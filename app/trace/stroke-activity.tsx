"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import bundledPrewriting from "@/content/prewriting.json";
import { scoreAttempt, type ScoreResult } from "@/app/engine/scoring/score";

type DrawPoint = { x: number; y: number };
type PrewritingStroke = typeof bundledPrewriting[number];

export function StrokeActivity() {
  const [strokes, setStrokes] = useState<PrewritingStroke[]>(bundledPrewriting);
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [points, setPoints] = useState<DrawPoint[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [contentNotice, setContentNotice] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const pointsRef = useRef<DrawPoint[]>([]);
  const guideRef = useRef<SVGPathElement>(null);
  const selectedStroke = strokes[Math.min(strokeIndex, strokes.length - 1)];

  useEffect(() => {
    let active = true;
    void fetch("/api/content?kind=prewriting")
      .then((response) => {
        if (!response.ok) throw new Error("Content request failed");
        return response.json() as Promise<{ items: PrewritingStroke[] }>;
      })
      .then((data) => {
        if (!active || data.items.length === 0) return;
        setStrokes(data.items);
        setStrokeIndex(0);
      })
      .catch(() => {
        console.error("[trace] Content refresh failed; bundled stroke guides are still available.");
        if (active) setContentNotice("We’re using the ready-to-practice stroke guides.");
      });
    return () => { active = false; };
  }, []);

  function readPoint(event: PointerEvent<SVGSVGElement>): DrawPoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 600,
      y: ((event.clientY - rect.top) / rect.height) * 300,
    };
  }

  function startDrawing(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const firstPoint = readPoint(event);
    pointsRef.current = [firstPoint];
    setPoints(pointsRef.current);
    setDrawing(true);
    setMessage("");
    setResult(null);
  }

  function continueDrawing(event: PointerEvent<SVGSVGElement>) {
    if (!drawing) return;
    // React may run the updater after the pointer event has ended, when currentTarget is null.
    const point = readPoint(event);
    pointsRef.current = [...pointsRef.current, point];
    setPoints(pointsRef.current);
  }

  function endDrawing(event: PointerEvent<SVGSVGElement>) {
    if (!drawing) return;
    setDrawing(false);
    if (pointsRef.current.length > 0) {
      pointsRef.current = [...pointsRef.current, readPoint(event)];
      setPoints(pointsRef.current);
    }
    const guide = guideRef.current;
    if (!guide || pointsRef.current.length < 2) {
      setMessage("Try following the line from the green dot.");
      setResult(null);
      return;
    }
    const length = guide.getTotalLength();
    const count = Math.max(24, Math.ceil(length / 4));
    const template = Array.from({ length: count }, (_, index) => {
      const point = guide.getPointAtLength(length * index / (count - 1));
      return { x: point.x / 600, y: point.y / 300 };
    });
    const userStroke = pointsRef.current.map((point) => ({ x: point.x / 600, y: point.y / 300 }));
    const scored = scoreAttempt([userStroke], [template], { tolerance: 0.09, scoreOrder: false });
    setResult(scored);
    setMessage(scored.stars >= 2
      ? "Lovely tracing! You followed the guide."
      : "Good try! Start at the green dot and follow the line slowly.");
  }

  function clearStroke() {
    setPoints([]);
    pointsRef.current = [];
    setMessage("");
    setResult(null);
  }

  function nextStroke() {
    if (strokeIndex < strokes.length - 1) {
      setStrokeIndex(strokeIndex + 1);
    } else {
      setStrokeIndex(0);
      setMessage("You practiced every first stroke. A strong start!");
    }
    setPoints([]);
    pointsRef.current = [];
    setResult(null);
  }

  const drawnPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <main className="activity-shell trace-activity">
      <header className="activity-header">
        <Link className="back-link" href="/trace" aria-label="Back to tracing">←</Link>
        <div><span className="activity-eyebrow">TRACE · FIRST STROKES</span><h1>Practice a {selectedStroke.name.toLowerCase()}</h1></div>
        <span className="activity-level">✏️ <span>{strokeIndex + 1} of {strokes.length}</span></span>
      </header>
      <div className="puzzle-prompt"><span aria-hidden="true">🐰</span><p>Follow the dotted path with your finger or a pen.</p></div>
      <div className="stroke-picker" aria-label="Choose a practice stroke">
        {strokes.map((stroke, index) => <button className={index === strokeIndex ? "selected" : ""} key={stroke.id} onClick={() => { setStrokeIndex(index); setPoints([]); pointsRef.current = []; setMessage(""); setResult(null); }} aria-label={stroke.name} aria-current={index === strokeIndex ? "step" : undefined}>{stroke.glyph}</button>)}
      </div>
      {contentNotice && <p className="content-notice" role="status">{contentNotice}</p>}
      <div className="paper-wrap">
        <svg
          className="practice-paper"
          viewBox="0 0 600 300"
          role="img"
          aria-label={`${selectedStroke.name} tracing canvas`}
          onPointerDown={startDrawing}
          onPointerMove={continueDrawing}
          onPointerUp={endDrawing}
          onPointerCancel={() => setDrawing(false)}
        >
          <path className="paper-rule" d="M25 75 H575 M25 150 H575 M25 225 H575" />
          <path ref={guideRef} className="trace-guide" d={selectedStroke.path} />
          {points.length > 0 && <>
            <circle className="start-dot" cx={points[0].x} cy={points[0].y} r="10" />
            <path className="child-stroke" d={drawnPath} />
          </>}
          {points.length === 0 && <circle className="start-dot" cx={selectedStroke.start.x} cy={selectedStroke.start.y} r="10" />}
        </svg>
      </div>
      {message && <div className="kind-feedback" role="status"><span aria-hidden="true">{result && result.stars < 2 ? "🌱" : "✨"}</span> {message}{result && <span className="trace-score" aria-label={`${result.stars} stars`}> {"★".repeat(result.stars)}{"☆".repeat(3 - result.stars)}</span>}</div>}
      <div className="trace-actions"><button className="secondary-action" onClick={clearStroke}>Clear <span aria-hidden="true">↺</span></button><button className="primary-action" onClick={nextStroke}>Next stroke <span aria-hidden="true">→</span></button></div>
      <div className="help-row">
        <button className={`help-button ${hintOpen ? "selected" : ""}`} onClick={() => setHintOpen(!hintOpen)}><span>💡</span> Need a hint?</button>
        <button className="help-button" onClick={() => setTeacherOpen(!teacherOpen)}><span>✋</span> Ask your teacher</button>
      </div>
      {(hintOpen || teacherOpen) && <aside className="teacher-note"><strong>{teacherOpen ? "Teacher card · Start at the dot" : "A little look"}</strong><p>{teacherOpen ? "Say: Watch my finger follow the line. Ask: Which way will your hand go? Mix-up: Let your child move at their own pace; direction comes before neatness." : "Start at the green dot. Move slowly along the soft blue line."}</p></aside>}
    </main>
  );
}
