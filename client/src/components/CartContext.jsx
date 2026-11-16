import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("qb_cart") || "[]"); }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem("qb_cart", JSON.stringify(items)), [items]);

  function addToCart(product, size) {
    setItems((current) => {
      const found = current.find((item) => item._id === product._id && item.size === size);
      if (found) return current.map((item) =>
        item._id === product._id && item.size === size
          ? { ...item, quantity: item.quantity + 1 } : item
      );
      return [...current, { ...product, size, quantity: 1 }];
    });
  }

  function changeQuantity(id, size, amount) {
    setItems((current) => current
      .map((item) => item._id === id && item.size === size
        ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(id, size) {
    setItems((current) => current.filter((item) => !(item._id === id && item.size === size)));
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  return (
    <CartContext.Provider value={{ items, total, addToCart, changeQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
