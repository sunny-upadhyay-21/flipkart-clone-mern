import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  function isWishlisted(productId) {
    return items.some((i) => i.productId === productId);
  }

  function toggleWishlist(product) {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === product._id);
      if (exists) {
        return prev.filter((i) => i.productId !== product._id);
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          mrp: product.mrp,
          brand: product.brand,
          rating: product.rating,
          numReviews: product.numReviews,
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleWishlist, removeFromWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
