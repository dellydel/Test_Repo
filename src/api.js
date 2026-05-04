const CUISINE_EMOJIS = {
  italian: "🍝",
  mexican: "🌮",
  japanese: "🍣",
  american: "🍔",
  thai: "🍜",
  indian: "🍛",
  chinese: "🥡",
  mediterranean: "🫒",
  french: "🥐",
  greek: "🫕",
};

function loadMapsSDK() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve();
    window.__mapsResolve = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places,geocoding&loading=async&callback=__mapsResolve`;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function geocodeCity(city) {
  return new Promise((resolve, reject) => {
    new window.google.maps.Geocoder().geocode(
      { address: city },
      (results, status) => {
        if (status === "OK") resolve(results[0].geometry.location);
        else reject(new Error(`Geocode failed: ${status}`));
      },
    );
  });
}

export async function fetchRestaurants(city, filters, favorite = null) {
  if (!import.meta.env.VITE_GOOGLE_MAPS_KEY) {
    throw new Error("Google Maps API key is missing");
  }

  await loadMapsSDK();

  const location = await geocodeCity(city);

  const cuisineVotes = filters.flatMap((f) => Array.isArray(f.cuisine) ? f.cuisine : f.cuisine ? [f.cuisine] : []).filter(Boolean);
  const priceVotes = filters.flatMap((f) => f.price).filter(Boolean);
  const distVotes = filters.flatMap((f) => f.distance).filter(Boolean);
  const ratingVotes = filters.flatMap((f) => f.rating).filter(Boolean);
  const minRating = ratingVotes.length
    ? Math.max(...ratingVotes.map((r) => parseFloat(r)))
    : 0;

  const distToMeters = {
    "< 1 mi": 1600,
    "< 2 mi": 3200,
    "< 5 mi": 8000,
    Any: 16000,
  };
  const maxDistKey = distVotes.length
    ? distVotes.reduce((a, b) => (distToMeters[a] > distToMeters[b] ? a : b))
    : "Any";
  const radius = distToMeters[maxDistKey];

  const maxPrice = priceVotes.length
    ? Math.max(...priceVotes.map((p) => ({ $: 1, $$: 2, $$$: 3 })[p]))
    : 3;

  const keywords = cuisineVotes.length ? [...new Set(cuisineVotes.map((c) => c.toLowerCase()))] : ["restaurant"];

  const searchOne = (keyword) => new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.nearbySearch(
      { location, radius, type: "restaurant", keyword },
      (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results?.length) return resolve([]);
        const priceMap = [1, 1, 2, 3, 3];
        resolve(
          results
            .filter((r) => priceMap[r.price_level ?? 1] <= maxPrice)
            .filter((r) => (r.rating ?? 0) >= minRating)
            .map((r) => ({
              name: r.name,
              price: ["$", "$", "$$", "$$$", "$$$"][r.price_level ?? 1],
              distance: haversine(location.lat(), location.lng(), r.geometry.location.lat(), r.geometry.location.lng()),
              rating: r.rating ?? null,
              emoji: CUISINE_EMOJIS[keyword] || "🍽️",
              placeId: r.place_id,
            }))
        );
      }
    );
  });

  const allResults = await Promise.all(keywords.map(searchOne));

  // Merge, dedupe by placeId, shuffle, pick up to 2 per cuisine then fill to 6
  const seen = new Set();
  const perCuisine = allResults.map((results) =>
    results.filter((r) => {
      if (seen.has(r.placeId)) return false;
      seen.add(r.placeId);
      return true;
    }).sort(() => Math.random() - 0.5).slice(0, Math.ceil(6 / keywords.length))
  );

  let pool = perCuisine.flat().sort(() => Math.random() - 0.5).slice(0, 6);

  if (pool.length < 2) throw new Error("No restaurants found matching your filters");

  if (favorite && !pool.find((r) => r.placeId === favorite.placeId)) {
    const slot = Math.floor(Math.random() * (pool.length + 1));
    pool.splice(slot, 0, favorite);
    pool = pool.slice(0, 6);
  }

  return pool;
}