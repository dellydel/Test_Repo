import { useState } from "react";
import { fetchRestaurants } from "./api";
import SetupScreen from "./SetupScreen";
import SpinScreen from "./SpinScreen";
import ResultScreen from "./ResultScreen";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap";
document.head.appendChild(fontLink);

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [segments, setSegments] = useState([]);
  const [mode, setMode] = useState("pick");
  const [city, setCity] = useState("");
  const [winner, setWinner] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async ({ users, mode, city }) => {
    setMode(mode);
    setCity(city);
    setWinner(null);
    setLoading(true);
    setError(null);
    try {
      const restaurants = await fetchRestaurants(city, users);
      setSegments(restaurants);
      setScreen("spin");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResult = (restaurant) => {
    setWinner(restaurant);
    setScreen("result");
  };

  const handleSpinAgain = () => {
    setWinner(null);
    setScreen("spin");
  };

  const handleReset = () => {
    setWinner(null);
    setSegments([]);
    setScreen("setup");
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "Fredoka One, sans-serif", fontSize: 24 }}>Finding restaurants... 🍽️</div>;
  if (error) return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#FF6B6B", fontFamily: "Nunito, sans-serif", gap: 16 }}><div>❌ {error}</div><button onClick={() => setError(null)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Try Again</button></div>;
  if (screen === "setup") return <SetupScreen onStart={handleStart} />;
  if (screen === "spin")
    return (
      <SpinScreen
        segments={segments}
        mode={mode}
        onResult={handleResult}
        onReset={handleReset}
      />
    );
  if (screen === "result")
    return (
      <ResultScreen
        winner={winner}
        city={city}
        onSpinAgain={handleSpinAgain}
        onReset={handleReset}
      />
    );
}
