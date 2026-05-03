import { Header } from "./Components";

export default function ResultScreen({ winner, city, onSpinAgain, onReset }) {
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
          maxWidth: 480,
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>

        <div
          style={{
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 26,
            color: "#FFD93D",
            marginBottom: 6,
          }}
        >
          Tonight's Pick!
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 24,
            padding: "32px 24px",
            marginTop: 16,
            marginBottom: 28,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>{winner?.emoji}</div>
          <div
            style={{
              fontFamily: "Fredoka One, sans-serif",
              fontSize: 30,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            {winner?.name}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{
                background: "rgba(255,211,61,0.2)",
                borderRadius: 20,
                padding: "5px 14px",
                color: "#FFD93D",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {winner?.price}
            </div>
            <div
              style={{
                background: "rgba(107,203,119,0.2)",
                borderRadius: 20,
                padding: "5px 14px",
                color: "#6BCB77",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              📍 {winner?.distance} mi · {city}
            </div>
          </div>
        </div>

        <button
          onClick={onSpinAgain}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #6BCB77, #4D96FF)",
            color: "#fff",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(77,150,255,0.35)",
            marginBottom: 12,
          }}
        >
          Spin Again! 🔄
        </button>

        <button
          onClick={onReset}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Change Players / Filters
        </button>
      </div>
    </div>
  );
}
