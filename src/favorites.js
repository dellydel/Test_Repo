const KEY = "dinner_spinner_favorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorite(restaurant) {
  const favs = getFavorites();
  if (favs.find((f) => f.placeId === restaurant.placeId)) return;
  localStorage.setItem(KEY, JSON.stringify([...favs, restaurant]));
}

export function removeFavorite(placeId) {
  const favs = getFavorites().filter((f) => f.placeId !== placeId);
  localStorage.setItem(KEY, JSON.stringify(favs));
}
