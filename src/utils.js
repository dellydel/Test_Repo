import {
  RESTAURANT_POOL,
  CUISINES,
  priceToNum,
  distToNum,
  SEGMENT_COLORS,
} from "./constants";

export function getRestaurants(filters) {
  const cuisineVotes = filters.flatMap((f) => f.cuisine).filter(Boolean);
  const priceVotes = filters.flatMap((f) => f.price).filter(Boolean);
  const distVotes = filters.flatMap((f) => f.distance).filter(Boolean);

  const allowedCuisines = cuisineVotes.length
    ? [...new Set(cuisineVotes)]
    : CUISINES;
  const maxPrice = priceVotes.length
    ? Math.max(...priceVotes.map((p) => priceToNum[p]))
    : 3;
  const maxDist = distVotes.length
    ? Math.max(...distVotes.map((d) => distToNum[d]))
    : 999;

  let pool = allowedCuisines.flatMap((c) => RESTAURANT_POOL[c] || []);
  pool = pool.filter(
    (r) => priceToNum[r.price] <= maxPrice && r.distance <= maxDist,
  );
  pool = pool.sort(() => Math.random() - 0.5).slice(0, 6);
  return pool.length >= 2 ? pool : RESTAURANT_POOL.American.slice(0, 6);
}

export function drawWheel(canvas, segments, rotation, eliminated = []) {
  if (!canvas || segments.length === 0) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const cx = W / 2,
    cy = W / 2,
    r = W / 2 - 8;
  ctx.clearRect(0, 0, W, W);

  const activeSegs = segments.filter((_, i) => !eliminated.includes(i));
  if (activeSegs.length === 0) return;

  const arc = (2 * Math.PI) / activeSegs.length;
  let drawn = 0;

  segments.forEach((seg, origIdx) => {
    if (eliminated.includes(origIdx)) return;
    const start = rotation + drawn * arc - Math.PI / 2;
    const end = start + arc;
    const color = SEGMENT_COLORS[origIdx % SEGMENT_COLORS.length];

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const mid = start + arc / 2;
    const labelR = r * 0.62;
    const lx = cx + labelR * Math.cos(mid);
    const ly = cy + labelR * Math.sin(mid);

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(mid + Math.PI / 2);

    ctx.font = `${Math.max(14, Math.min(22, W / 14))}px serif`;
    ctx.textAlign = "center";
    ctx.fillText(seg.emoji, 0, -14);

    ctx.font = `bold ${Math.max(9, Math.min(13, W / 24))}px Nunito, sans-serif`;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 3;
    const words = seg.name.split(" ");
    if (words.length <= 2 || arc > 1.2) {
      ctx.fillText(seg.name, 0, 2);
    } else {
      ctx.fillText(words.slice(0, 2).join(" "), 0, -2);
      ctx.fillText(words.slice(2).join(" "), 0, 12);
    }
    ctx.restore();
    drawn++;
  });

  const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  hubGrad.addColorStop(0, "#fff");
  hubGrad.addColorStop(1, "#e0e0e0");
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
  ctx.fillStyle = hubGrad;
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "20px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍽️", cx, cy);
}
