import { CUISINES, PRICES, DISTANCES } from "./constants";

export function Header() {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: "28px 20px 16px",
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 24,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 4 }}>🍽️</div>
      <div
        style={{
          fontFamily: "Fredoka One, sans-serif",
          fontSize: 34,
          background:
            "linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: 1,
        }}
      >
        Dinner Spinner
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 13,
          marginTop: 2,
          fontWeight: 600,
        }}
      >
        Let the wheel decide! 🎡
      </div>
    </div>
  );
}

export function FilterChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 20,
        border: selected ? "2px solid #FF6B6B" : "2px solid #e0e0e0",
        background: selected ? "#FF6B6B" : "#fff",
        color: selected ? "#fff" : "#555",
        fontFamily: "Nunito, sans-serif",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export function UserFilterCard({ user, onRemove, onChange }) {
  const toggle = (cat, val) => {
    onChange(cat, user[cat] === val ? null : val);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 17,
            color: "#333",
          }}
        >
          {user.name}
        </span>
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "#bbb",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 11,
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 5,
          }}
        >
          Cuisine
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {CUISINES.map((c) => (
            <FilterChip
              key={c}
              label={c}
              selected={user.cuisine === c}
              onClick={() => toggle("cuisine", c)}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 11,
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 5,
          }}
        >
          Price
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {PRICES.map((p) => (
            <FilterChip
              key={p}
              label={p}
              selected={user.price === p}
              onClick={() => toggle("price", p)}
            />
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: 11,
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 5,
          }}
        >
          Distance
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {DISTANCES.map((d) => (
            <FilterChip
              key={d}
              label={d}
              selected={user.distance === d}
              onClick={() => toggle("distance", d)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
