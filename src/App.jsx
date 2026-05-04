import { useState, useEffect } from "react";
import { fetchRestaurants } from "./api";
import SetupScreen from "./SetupScreen";
import SpinScreen from "./SpinScreen";
import ResultScreen from "./ResultScreen";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap";
document.head.appendChild(fontLink);

function AnimatedDots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ display: "inline-block", width: 24, textAlign: "left" }}>{dots}</span>;
}

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [segments, setSegments] = useState([]);
  const [mode, setMode] = useState("pick");
  const [city, setCity] = useState("");
  const [users, setUsers] = useState([]);
  const [favorite, setFavorite] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndSpin = async (city, users, favorite) => {
    setLoading(true);
    setError(null);
    try {
      const restaurants = await fetchRestaurants(city, users, favorite);
      setSegments(restaurants);
      setScreen("spin");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async ({ users, mode, city, favorite }) => {
    setMode(mode);
    setCity(city);
    setUsers(users);
    setFavorite(favorite);
    setWinner(null);
    await fetchAndSpin(city, users, favorite);
  };

  const handleResult = (restaurant) => {
    setWinner(restaurant);
    setScreen("result");
  };

  const handleSpinAgain = async () => {
    setWinner(null);
    await fetchAndSpin(city, users, favorite);
  };

  const handleReset = () => {
    setWinner(null);
    setSegments([]);
    setScreen("setup");
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "Fredoka One, sans-serif", fontSize: 24 }}>Finding Restaurants<AnimatedDots /> 🍽️</div>;
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
