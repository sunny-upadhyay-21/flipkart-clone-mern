const KEY = 'recentlyViewed';
const MAX_ITEMS = 8;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(product) {
  const existing = getRecentlyViewed().filter((p) => p._id !== product._id);
  const entry = {
    _id: product._id,
    title: product.title,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
    brand: product.brand,
  };
  const updated = [entry, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
