import { useState } from "react";
import { Header, UserFilterCard } from "./Components";
import FavoritesModal from "./FavoritesModal";

export default function SetupScreen({ onStart }) {
  const [users, setUsers] = useState([
    { id: 1, name: "Guest 1", cuisine: [], price: null, distance: null, rating: null },
  ]);
  const [newName, setNewName] = useState("");
  const [mode, setMode] = useState("pick");
  const [city, setCity] = useState("Dallas, TX");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const handleFavoriteSelect = (fav) => {
    setSelectedFavorite(fav);
    setShowFavorites(false);
  };

  const addUser = () => {
    const name = newName.trim() || `Guest ${users.length + 1}`;
    setUsers([
      ...users,
      { id: Date.now(), name, cuisine: [], price: null, distance: null, rating: null },
    ]);
    setNewName("");
  };

  const removeUser = (id) => setUsers(users.filter((u) => u.id !== id));

  const updateUser = (id, cat, val) =>
    setUsers(users.map((u) => (u.id === id ? { ...u, [cat]: val } : u)));

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
      <div style={{ width: "100%", maxWidth: 480, padding: "0 16px" }}>
        {/* City */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            📍 City
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Chicago, IL"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Mode */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            🎮 Spin Mode
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              ["pick", "🏆 Pick a Winner"],
              ["eliminate", "❌ Elimination"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setMode(val)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: 12,
                  border:
                    mode === val
                      ? "2px solid #FF6B6B"
                      : "2px solid rgba(255,255,255,0.15)",
                  background:
                    mode === val
                      ? "rgba(255,107,107,0.25)"
                      : "rgba(255,255,255,0.06)",
                  color: mode === val ? "#FF6B6B" : "rgba(255,255,255,0.6)",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 12,
              marginTop: 6,
              fontWeight: 600,
            }}
          >
            {mode === "pick"
              ? "One spin picks the restaurant!"
              : "Each spin eliminates one, last one wins!"}
          </div>
        </div>

        {/* Players */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Guests & Preferences
          </label>
          {users.map((u) => (
            <UserFilterCard
              key={u.id}
              user={u}
              onRemove={() => removeUser(u.id)}
              onChange={(cat, val) => updateUser(u.id, cat, val)}
            />
          ))}
        </div>

        {/* Add player */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addUser()}
            placeholder="Guest name..."
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={addUser}
            style={{
              padding: "11px 18px",
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>

        {/* Favorites */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setShowFavorites(true)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "2px solid rgba(255,211,61,0.3)",
              background: "rgba(255,211,61,0.08)",
              color: "#FFD93D",
              fontFamily: "Fredoka One, sans-serif",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ⭐ Add a Favorite to the Wheel
          </button>
          {selectedFavorite && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,211,61,0.1)",
                border: "1px solid rgba(255,211,61,0.3)",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <span style={{ color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14 }}>
                {selectedFavorite.emoji} {selectedFavorite.name} will be added to the wheel
              </span>
              <button
                onClick={() => setSelectedFavorite(null)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Start */}
        <button
          onClick={() => onStart({ users, mode, city, favorite: selectedFavorite })}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #FF6B6B, #FF922B)",
            color: "#fff",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(255,107,107,0.4)",
            letterSpacing: 0.5,
          }}
        >
          Find Restaurants! 🚀
        </button>
      </div>
      {showFavorites && (
        <FavoritesModal
          onSelect={handleFavoriteSelect}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </div>
  );
}
