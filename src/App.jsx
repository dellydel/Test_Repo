import { useState } from "react";
import { getRestaurants } from "./utils";
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

  const handleStart = ({ users, mode, city }) => {
    setMode(mode);
    setCity(city);
    setSegments(getRestaurants(users));
    setWinner(null);
    setScreen("spin");
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
