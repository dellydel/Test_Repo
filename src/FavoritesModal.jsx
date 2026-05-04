import { useState } from "react";
import { getFavorites, removeFavorite } from "./favorites";

export default function FavoritesModal({ onSelect, onClose }) {
  const [favs, setFavs] = useState(getFavorites());

  const handleRemove = (placeId) => {
    removeFavorite(placeId);
    setFavs(getFavorites());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 24,
          padding: 24,
          width: "100%",
          maxWidth: 420,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 22,
            color: "#FFD93D",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          ⭐ Favorite Restaurants
        </div>

        {favs.length === 0 ? (
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
              fontSize: 14,
              padding: "24px 0",
            }}
          >
            No favorites saved yet. Save restaurants from the results screen!
          </div>
        ) : (
          <>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Nunito, sans-serif",
                fontSize: 12,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Tap a restaurant to add it to the wheel
            </div>
            {favs.map((f) => (
              <div
                key={f.placeId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
                onClick={() => onSelect(f)}
              >
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Fredoka One, sans-serif",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <span style={{ color: "#FFD93D", fontSize: 12, fontWeight: 700 }}>{f.price}</span>
                    {f.rating && <span style={{ color: "#FF922B", fontSize: 12, fontWeight: 700 }}>⭐ {f.rating}</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(f.placeId); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 18,
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px",
            borderRadius: 50,
            border: "none",
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
