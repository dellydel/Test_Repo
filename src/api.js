const CUISINE_EMOJIS = {
  italian: "🍝", mexican: "🌮", japanese: "🍣", american: "🍔",
  thai: "🍜", indian: "🍛", chinese: "🥡", mediterranean: "🫒",
  french: "🥐", greek: "🫕",
};

function loadMapsSDK() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function geocodeCity(city) {
  return new Promise((resolve, reject) => {
    new window.google.maps.Geocoder().geocode({ address: city }, (results, status) => {
      if (status === "OK") resolve(results[0].geometry.location);
      else reject(new Error(`Geocode failed: ${status}`));
    });
  });
}

function priceLevel(price) {
  if (price === "$") return [0, 1];
  if (price === "$$") return [0, 2];
  return [0, 3];
}

export async function fetchRestaurants(city, filters) {
  await loadMapsSDK();

  const location = await geocodeCity(city);

  const cuisineVotes = filters.flatMap((f) => f.cuisine).filter(Boolean);
  const priceVotes = filters.flatMap((f) => f.price).filter(Boolean);
  const distVotes = filters.flatMap((f) => f.distance).filter(Boolean);

  const distToMeters = { "< 1 mi": 1600, "< 2 mi": 3200, "< 5 mi": 8000, Any: 16000 };
  const maxDistKey = distVotes.length
    ? distVotes.reduce((a, b) => distToMeters[a] > distToMeters[b] ? a : b)
    : "Any";
  const radius = distToMeters[maxDistKey];

  const maxPrice = priceVotes.length
    ? Math.max(...priceVotes.map((p) => ({ $: 1, $$: 2, $$$: 3 })[p]))
    : 3;

  const keyword = cuisineVotes.length ? cuisineVotes[0].toLowerCase() : "restaurant";

  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.nearbySearch(
      { location, radius, type: "restaurant", keyword },
      (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results?.length) {
          return reject(new Error("No restaurants found"));
        }

        const priceMap = [1, 1, 2, 3, 3];
        const filtered = results
          .filter((r) => priceMap[r.price_level ?? 1] <= maxPrice)
          .slice(0, 6)
          .map((r) => {
            const cuisine = cuisineVotes[0]?.toLowerCase() || "restaurant";
            return {
              name: r.name,
              price: ["$", "$", "$$", "$$$", "$$$"][r.price_level ?? 1],
              distance: parseFloat((r.geometry.location.lat() * 0).toFixed(1)) || "?",
              emoji: CUISINE_EMOJIS[cuisine] || "🍽️",
              placeId: r.place_id,
            };
          });

        resolve(filtered.length >= 2 ? filtered : results.slice(0, 6).map((r) => ({
          name: r.name, price: "$$", distance: "?", emoji: "🍽️", placeId: r.place_id,
        })));
      }
    );
  });
}
