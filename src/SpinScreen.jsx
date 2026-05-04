import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "./Components";
import { drawWheel } from "./utils";

export default function SpinScreen({ segments, mode, onResult, onReset }) {
  const [eliminated, setEliminated] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(340);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const rotRef = useRef(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const size = Math.min(entry.contentRect.width, 500);
      setWheelSize(size);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    drawWheel(canvasRef.current, segments, rotation, eliminated);
  }, [segments, rotation, eliminated, wheelSize]);

  const getActiveIndices = useCallback(() => {
    return segments.map((_, i) => i).filter((i) => !eliminated.includes(i));
  }, [segments, eliminated]);

  const spin = () => {
    if (spinning) return;
    const active = getActiveIndices();
    if (active.length === 0) return;

    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5;
    const targetAngle = extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 3500 + Math.random() * 1000;
    const start = performance.now();
    const startRot = rotRef.current;
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const current = startRot + targetAngle * ease(t);
      rotRef.current = current;
      setRotation(current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const arc = (2 * Math.PI) / active.length;
        const normalized = ((-(current % (2 * Math.PI))) + 2 * Math.PI) % (2 * Math.PI);
        const activeSlot = Math.floor(normalized / arc) % active.length;
        const landed = active[activeSlot];
        setSpinning(false);

        if (mode === "pick") {
          onResult(segments[landed]);
        } else {
          const newElim = [...eliminated, landed];
          setEliminated(newElim);
          const remaining = active.filter((i) => i !== landed);
          if (remaining.length === 1) {
            onResult(segments[remaining[0]]);
          }
        }
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const active = getActiveIndices();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 40,
      }}
    >
      <Header />
      <div
        style={{
        width: "100%",
          maxWidth: 540,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Mode badge */}
        <div
          style={{
            background:
              mode === "pick"
                ? "rgba(255,146,43,0.2)"
                : "rgba(255,107,107,0.2)",
            border: `1px solid ${mode === "pick" ? "rgba(255,146,43,0.4)" : "rgba(255,107,107,0.4)"}`,
            color: mode === "pick" ? "#FF922B" : "#FF6B6B",
            borderRadius: 20,
            padding: "12px 28px",
            fontFamily: "Fredoka One, sans-serif",
            fontWeight: 800,
            fontSize: 22,
            marginTop: 16,
            marginBottom: 48,
          }}
        >
          {mode === "pick"
            ? "🏆 Pick a Winner"
            : `❌ Elimination · ${active.length} left`}
        </div>

        {/* Wheel + pointer */}
        <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: 500, marginBottom: 32 }}>
          <div
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: `${wheelSize * 0.036}px solid transparent`,
              borderRight: `${wheelSize * 0.036}px solid transparent`,
              borderTop: `${wheelSize * 0.076}px solid #FFD93D`,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
              zIndex: 10,
            }}
          />
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            style={{
              width: "100%",
              borderRadius: "50%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              display: "block",
            }}
          />
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "16px 48px",
            borderRadius: 50,
            border: "none",
            background: spinning
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, #FFD93D, #FF922B)",
            color: spinning ? "rgba(255,255,255,0.4)" : "#fff",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 22,
            cursor: spinning ? "default" : "pointer",
            boxShadow: spinning ? "none" : "0 8px 28px rgba(255,211,61,0.45)",
            transition: "all 0.25s",
            letterSpacing: 0.5,
          }}
        >
          {spinning ? "Spinning... 🌀" : "SPIN! 🎰"}
        </button>

        {/* Eliminated list */}
        {eliminated.length > 0 && (
          <div style={{ marginTop: 24, width: "100%" }}>
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontWeight: 800,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Eliminated
            </div>
            {eliminated.map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 20 }}>{segments[i].emoji}</span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "line-through",
                  }}
                >
                  {segments[i].name}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onReset}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "16px 48px",
            borderRadius: 50,
            border: "none",
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 22,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
        >
          ← Back to Setup
        </button>
      </div>
    </div>
  );
}
